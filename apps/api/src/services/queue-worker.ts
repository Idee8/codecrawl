import 'dotenv/config';
import { Worker, type Job, type Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';

import { logger as _logger } from '../lib/logger';
import { getGenerateLlmsTxtQueue, redisConnection } from './queue-service';
import systemMonitor from './system-monitor';
import {
  cleanOldConcurrencyLimitEntries,
  pushConcurrencyLimitActiveJob,
  removeConcurrencyLimitActiveJob,
  takeConcurrencyLimitedJob,
} from '../lib/concurrency-limit';
import { updateGeneratedLlmsTxt } from '../lib/generate-llms-txt/redis';
import { performGenerateLlmsTxt } from '../lib/generate-llms-txt';

class RacedRedirectError extends Error {
  constructor() {
    super('Raced redirect error');
  }
}

/**
 * Globals
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const runningJobs: Set<string> = new Set();
const workerLockDuration = Number(process.env.WORKER_LOCK_DURATION) || 6000;
const workerStalledCheckInterval =
  Number(process.env.WORKER_STALLED_CHECK_INTERVAL) || 30000;
const jobLockExtendInterval =
  Number(process.env.JOB_LOCK_EXTEND_INTERVAL) || 15000;
const jobLockExtensionTime =
  Number(process.env.JOB_LOCK_EXTENSION_TIME) || 60000;

const cantAcceptConnectionInterval =
  Number(process.env.CANT_ACCEPT_CONNECTION_INTERVAL) || 2000;
const connectionMonitorInterval =
  Number(process.env.CONNECTION_MONITOR_INTERVAL) || 10;
const gotJobInterval = Number(process.env.CONNECTION_MONITOR_INTERVAL) || 20;

/**
 * Core Layer
 */
let isShuttingDown = false;

process.on('SIGINT', () => {
  console.log('Received SIGTERM. Shutting down gracefully...');
  isShuttingDown = true;
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down gracefully...');
  isShuttingDown = true;
});

let cantAcceptConnectionCount = 0;

/**
 * Worker function runner and processor utility
 * @param queue - Queue storing jobs to be processed by the woker
 * @param processJobInternal - Process Job function
 */
const workerFun = async (
  queue: Queue,
  processJobInternal: (token: string, job: Job) => Promise<any>,
) => {
  const loggger = _logger.child({
    module: 'queue-worker',
    method: 'workerFun',
  });

  const worker = new Worker(queue.name, null, {
    connection: redisConnection,
    lockDuration: 1 * 60 * 1000, // 1 minute
    stalledInterval: 30 * 1000, // 30 seconds
    maxStalledCount: 10, // 10 times
  });

  worker.startStalledCheckTimer();

  const monitor = await systemMonitor;

  while (true) {
    if (isShuttingDown) {
      console.log('No longer accepting new jobs. SIGINT');
      break;
    }
    const token = uuidv4();
    const canAcceptConnection = await monitor.acceptConnection();

    if (!canAcceptConnection) {
      console.log("Can't accept connection due to RAM/CPU load");
      loggger.info("Can't accept connection due to RAM/CPU load");
      cantAcceptConnectionCount++;

      if (cantAcceptConnectionCount >= 25) {
        loggger.error('WORKER STALLED', {
          cpuUsage: await monitor.checkCpuUsage(),
          memoryUsage: await monitor.checkMemoryUsage(),
        });
      }

      await sleep(cantAcceptConnectionInterval); // more sleep
      continue;
    } else {
      cantAcceptConnectionCount = 0;
    }

    const job = await worker.getNextJob(token);

    if (job) {
      if (job.id) {
        runningJobs.add(job.id);
      }

      async function afterJobDone(job: Job<any, any, string>) {
        if (job.id) {
          runningJobs.delete(job.id);
        }

        if (job.id && job.data && job.data.teamId && job.data.plan) {
          await removeConcurrencyLimitActiveJob(job.data.teamId, job.id);
          cleanOldConcurrencyLimitEntries(job.data.teamId);

          // Queue up next job, if it exists
          // No need to check if we're under the limit here -- if the current job is finished
          // we are 1 under the limit, assuming the job insertion logic never over-inserts.
          const nextJob = await takeConcurrencyLimitedJob(job.data.teamId);
          if (nextJob !== null) {
            await pushConcurrencyLimitActiveJob(
              job.data.teamId,
              nextJob.id,
              60 * 1000,
            ); // 60s initial timeout

            await queue.add(
              nextJob.id,
              {
                ...nextJob.data,
                concurrencyLimitHit: true,
              },
              {
                ...nextJob.opts,
                jobId: nextJob.id,
                priority: nextJob.priority,
              },
            );
          }
        }
      }

      if (job.data) {
        processJobInternal(token, job).finally(() => afterJobDone(job));
      } else {
        processJobInternal(token, job).finally(() => afterJobDone(job));
      }

      await sleep(gotJobInterval);
    } else {
      await sleep(connectionMonitorInterval);
    }
  }
};

/**
 * Job Processors
 */

const processGenerateLlmsTxtJobInternal = async (
  token: string,
  job: Job & { id: string },
) => {
  const logger = _logger.child({
    module: 'generate-llmstxt-worker',
    method: 'processJobInternal',
    jobId: job.id,
    generateId: job.data.generateId,
    teamId: job.data?.teamId ?? undefined,
  });

  const extendLockInterval = setInterval(async () => {
    logger.info(`🔄 Worker extending lock on job ${job.id}`);
    await job.extendLock(token, jobLockExtensionTime);
  }, jobLockExtendInterval);

  try {
    const result = await performGenerateLlmsTxt({
      generationId: job.data.generationId,
      teamId: job.data.teamId,
      plan: job.data.plan,
      url: job.data.request.url,
      maxUrls: job.data.request.maxUrls,
      showFullText: job.data.request.showFullText,
      subId: job.data.subId,
    });

    if (result?.success) {
      await job.moveToCompleted(result, token, false);
      await updateGeneratedLlmsTxt(job.data.generateId, {
        status: 'completed',
        generatedText: result.data.generatedText,
        fullText: result.data.fullText,
      });
      return result;
    } else {
      const error = new Error(
        'LLMs text generation failed without specific error',
      );
      await job.moveToFailed(error, token, false);
      await updateGeneratedLlmsTxt(job.data.generateId, {
        status: 'failed',
        error: error.message,
      });
      return { success: false, error: error.message };
    }
  } catch (error) {
    logger.error(`🚫 Job errored ${job.id} - ${error}`, { error });

    try {
      await job.moveToFailed(error, token, false);
    } catch (e) {
      logger.error('Failed to move job to failed state in Redis', { error });
    }

    await updateGeneratedLlmsTxt(job.data.generateId, {
      status: 'failed',
      error: error.message || 'Unknown error occurred',
    });

    return { success: false, error: error.message || 'Unknown error occurred' };
  } finally {
    clearInterval(extendLockInterval);
  }
};

// Start all workers
(async () => {
  await Promise.all([
    workerFun(getGenerateLlmsTxtQueue(), processGenerateLlmsTxtJobInternal),
  ]);

  console.log('All workers exited. Waiting for all jobs to finish...');

  while (runningJobs.size > 0) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log('All jobs finished. Worker out!');
  process.exit(0);
})();
