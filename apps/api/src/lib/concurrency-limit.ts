import type { JobsOptions } from 'bullmq';

import { redisConnection } from '../services/queue-service';

const constructKey = (teamId: string) => `concurrency-limiter:${teamId}`;
const constructQueueKey = (teamId: string) =>
  `concurrency-limit-queue:${teamId}`;

export async function cleanOldConcurrencyLimitEntries(
  teamId: string,
  now: number = Date.now(),
) {
  await redisConnection.zremrangebyscore(
    constructKey(teamId),
    Number.NEGATIVE_INFINITY,
    now,
  );
}

export async function getConcurrencyLimitActiveJobs(
  teamId: string,
  now: number = Date.now(),
): Promise<string[]> {
  return await redisConnection.zrangebyscore(
    constructKey(teamId),
    now,
    Number.POSITIVE_INFINITY,
  );
}

export async function pushConcurrencyLimitActiveJob(
  teamId: string,
  id: string,
  timeout: number,
  now: number = Date.now(),
) {
  await redisConnection.zadd(constructKey(teamId), now + timeout, id);
}

export async function removeConcurrencyLimitActiveJob(
  teamId: string,
  id: string,
) {
  await redisConnection.zrem(constructKey(teamId), id);
}

export type ConcurrencyLimitedJob = {
  id: string;
  data: any;
  opts: JobsOptions;
  priority?: number;
};

export async function takeConcurrencyLimitedJob(
  teamId: string,
): Promise<ConcurrencyLimitedJob | null> {
  const res = await redisConnection.zmpop(1, constructQueueKey(teamId), 'MIN');
  if (res === null || res === undefined) {
    return null;
  }

  return JSON.parse(res[1][0][0]);
}

export async function pushConcurrencyLimitedJob(
  teamId: string,
  job: ConcurrencyLimitedJob,
) {
  await redisConnection.zadd(
    constructQueueKey(teamId),
    job.priority ?? 1,
    JSON.stringify(job),
  );
}

export async function getConcurrencyLimitedJobs(teamId: string) {
  return new Set(
    (await redisConnection.zrange(constructQueueKey(teamId), 0, -1)).map(
      (x) => JSON.parse(x).id,
    ),
  );
}

export async function getConcurrencyQueueJobsCount(
  teamId: string,
): Promise<number> {
  const count = await redisConnection.zcard(constructQueueKey(teamId));
  return count;
}
