import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import expressWs from 'express-ws';
import CacheableLookup from 'cacheable-lookup';
import http from 'node:http';
import https from 'node:https';
import os from 'node:os';

import { v1Router } from '~/routes/v1';
import { logger } from '~/lib/logger';

const numCPUs = process.env.NODE_ENV === 'production' ? os.cpus().length : 2;

logger.info(`Number of CPUs: ${numCPUs} available`);

const cacheable = new CacheableLookup();

cacheable.install(http.globalAgent);
cacheable.install(https.globalAgent);

const ws = expressWs(express());
const app = ws.app;

declare global {
  var isProduction: boolean;
}

global.isProduction = process.env.IS_PRODUCTION === 'true';

app.use(
  cors({
    credentials: true,
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.send('CRAWLERS: Hello World');
});

// register router
app.use('/v1', v1Router);

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

app.get('/is-production', (_req, res) => {
  res.send({ isProduction: global.isProduction });
});

logger.info(`Worker ${process.pid} started`);
