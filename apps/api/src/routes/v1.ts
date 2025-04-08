import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import expressWs from 'express-ws';
import { fromNodeHeaders } from 'better-auth/node';

import { generateLLMsTextController } from '../controllers/v1/generate-llmstxt';
import { generateLLMsTextStatusController } from '../controllers/v1/generate-llmstxt-status';
import { userMeController } from '../controllers/v1/user';
import { RateLimiterMode } from '../types';
import type { RequestWithSession } from '../controllers/types';
import { auth } from '../lib/auth';

expressWs(express());

export function wrap(
  controller: (req: Request, res: Response) => Promise<any>,
): (req: Request, res: Response, next: NextFunction) => any {
  return (req, res, next) => {
    controller(req, res).catch((err) => next(err));
  };
}

export function authMiddleware(
  _rateLimiterMode: RateLimiterMode,
): (req: RequestWithSession, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    (async () => {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session?.session) {
        if (!session?.user) {
          return res
            .status(402)
            .json({ success: false, error: 'Not authorized' });
        } else {
          return;
        }
      }

      req.session = session;

      return next();
    })().catch((err) => next(err));
  };
}

export const v1Router = express.Router();

v1Router.get('/user/me', wrap(userMeController));
v1Router.post('/llmstxt', wrap(generateLLMsTextController));
v1Router.get(
  '/llmstxt/:jobId',
  authMiddleware(RateLimiterMode.Crawl) as any,
  wrap(generateLLMsTextStatusController),
);
