import "dotenv/config";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import expressWs from "express-ws";
import CacheableLookup from "cacheable-lookup";
import http from "node:http";
import https from "node:https";
import os from "os";

import { logger } from "./lib/logger";

const numCPUs = process.env.NODE_ENV === "production" ? os.cpus().length : 2;

logger.info(`Number of CPUs: ${numCPUs} available`);

const cacheable = new CacheableLookup();

cacheable.install(http.globalAgent);
cacheable.install(https.globalAgent);

const ws = expressWs(express());
const app = ws.app;

global.isProduction = process.env.IS_PRODUCTION === "true";

app.use(cors());

app.get("/", (_req, res) => {
  res.send("CRAWLERS: Hello World");
});

app.get("/test", async (_req, res) => {
  res.send("Hello, world!");
});

const DEFAULT_PORT = process.env.PORT ?? 4000;
const HOST = process.env.HOST ?? "localhost";

function startServer(port = DEFAULT_PORT) {
  const server = app.listen(Number(port), HOST, () => {
    logger.info(`Worker ${process.pid} listening on port ${port}`);
  });

  const exitHandler = () => {
    logger.info("SIGTERM signal received closing: HTTP server");
    server.close(() => {
      logger.info("Server closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", exitHandler);
  process.on("SIGINT", exitHandler);
  return server;
}

if (require.main === module) {
  startServer();
}

app.get("/is-production", (req, res) => {
  res.send({ isProduction: global.isProduction });
});

logger.info(`Worker ${process.pid} started`);
