import express from 'express';
import expressWs from 'express-ws';

import { apiKeyAuthMiddleware, authMiddleware, wrap } from '~/middleware';
import { RateLimiterMode } from '~/types';
import { generateLLMsTextController } from '~/controllers/v1/generate-llmstxt';
import { generateLLMsTextStatusController } from '~/controllers/v1/generate-llmstxt-status';
import {
  userMeController,
  userApiKeysController,
  userCreateApiKeyController,
  userDeleteApiKeyController,
} from '~/controllers/v1/user';
import { livenessController } from '~/controllers/v1/liveness';
import { readinessController } from '~/controllers/v1/readiness';
import { login, register } from '~/controllers/v1/auth';
import { teamKeysController, teamsController } from '~/controllers/v1/teams';
import { generateTreeStatusController } from '~/controllers/v1/generate-tree-status';
import { generateTreeController } from '~/controllers/v1/generate-tree';

expressWs(express());

export const v1Router = express.Router();

v1Router.post('/auth/login', wrap(login));
v1Router.post('/auth/register', wrap(register));

v1Router.get('/health/liveness', wrap(livenessController));
v1Router.get('/health/readiness', wrap(readinessController));

v1Router.get('/users/me', authMiddleware(false), wrap(userMeController));
v1Router.get('/users/keys', authMiddleware(), wrap(userApiKeysController));
v1Router.post(
  '/users/keys',
  authMiddleware(),
  wrap(userCreateApiKeyController),
);
v1Router.delete(
  '/users/keys/:keyId',
  authMiddleware(),
  wrap(userDeleteApiKeyController),
);

v1Router.get('/teams/:teamId/keys', authMiddleware(), wrap(teamKeysController));
v1Router.get('/teams', authMiddleware(), wrap(teamsController));
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

v1Router.post(
  '/tree',
  apiKeyAuthMiddleware(RateLimiterMode.Crawl),
  wrap(generateTreeController),
);
v1Router.get(
  '/tree/:jobId',
  apiKeyAuthMiddleware(RateLimiterMode.CrawlStatus),
  wrap(generateTreeStatusController as any),
);
