import express from 'express';
import expressWs from 'express-ws';

import { RateLimiterMode } from '../types';
import { generateLLMsTextController } from '../controllers/v1/generate-llmstxt';
import { generateLLMsTextStatusController } from '../controllers/v1/generate-llmstxt-status';
import { userMeController } from '../controllers/v1/user';
import { livenessController } from '../controllers/v1/liveness';
import { readinessController } from '../controllers/v1/readiness';
import { authMiddleware, apiKeyAuthMiddleware, wrap } from '../middleware';

expressWs(express());

export const v1Router = express.Router();

v1Router.get('/health/liveness', wrap(livenessController));
v1Router.get('/health/readiness', wrap(readinessController));
v1Router.get('/user/me', authMiddleware() as any, wrap(userMeController));
v1Router.post(
  '/llmstxt',
  apiKeyAuthMiddleware(RateLimiterMode.Crawl),
  wrap(generateLLMsTextController),
);
v1Router.get(
  '/llmstxt/:jobId',
  apiKeyAuthMiddleware(RateLimiterMode.CrawlStatus),
  wrap(generateLLMsTextStatusController as any),
);
