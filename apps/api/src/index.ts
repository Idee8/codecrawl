import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import expressWs from 'express-ws';
import CacheableLookup from 'cacheable-lookup';
import http from 'node:http';
import https from 'node:https';
import os from 'node:os';

import { logger } from './lib/logger';
import { runRemoteAction } from './core/actions/remoteAction';

const numCPUs = process.env.NODE_ENV === 'production' ? os.cpus().length : 2;

logger.info(`Number of CPUs: ${numCPUs} available`);

const cacheable = new CacheableLookup();

cacheable.install(http.globalAgent);
cacheable.install(https.globalAgent);

const ws = expressWs(express());
const app = ws.app;

global.isProduction = process.env.IS_PRODUCTION === 'true';

app.use(cors());

app.get('/', (_req, res) => {
  res.send('CRAWLERS: Hello World');
});

app.get('/test', async (req, res) => {
  const repoUrl =
    (req.query.repoUrl as string) ?? 'https://github.com/irere123/run-lang';
  const { packResult } = await runRemoteAction(repoUrl, {
    compress: true,
    removeComments: true,
    removeEmptyLines: true,
  });
  res.send(packResult);
});

const DEFAULT_PORT = process.env.PORT ?? 4000;
const HOST = process.env.HOST ?? 'localhost';

function startServer(port = DEFAULT_PORT) {
  const server = app.listen(Number(port), HOST, () => {
    logger.info(`Worker ${process.pid} listening on port ${port}`);
  });

  const exitHandler = () => {
    logger.info('SIGTERM signal received closing: HTTP server');
    server.close(() => {
      logger.info('Server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', exitHandler);
  process.on('SIGINT', exitHandler);
  return server;
}

if (require.main === module) {
  startServer();
}

app.get('/is-production', (req, res) => {
  res.send({ isProduction: global.isProduction });
});

logger.info(`Worker ${process.pid} started`);
