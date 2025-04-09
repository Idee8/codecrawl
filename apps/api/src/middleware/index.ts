import type { NextFunction, Request, Response } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { APIError } from 'better-auth';

import type { RequestWithSession } from '../controllers/types';
import { redisRateLimitClient, getRateLimiter } from '../services/rate-limiter';
import { auth } from '../lib/auth';
import type { RateLimiterMode } from '../types';

const API_KEY_CACHE_PREFIX = 'apiKeyCache:';
const API_KEY_CACHE_TTL_SECONDS = 300;

export function wrap<Req extends Request = Request>(
  controller: (req: Req, res: Response) => Promise<any>,
): (req: Req, res: Response, next: NextFunction) => any {
  return (req, res, next) => {
    controller(req, res).catch((err) => next(err));
  };
}

export function authMiddleware(): (
  req: RequestWithSession,
  res: Response,
  next: NextFunction,
) => void {
  return (req, res, next) => {
    (async () => {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session?.session) {
        return res
          .status(401)
          .json({ success: false, error: 'Unauthorized: Session required' });
      }

      req.session = session;
      return next();
    })().catch((err) => next(err));
  };
}

export function apiKeyAuthMiddleware(
  mode: RateLimiterMode,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    (async () => {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error:
            'Unauthorized: Missing or invalid Authorization header (Bearer <key> expected)',
        });
      }

      const apiKey = authHeader.split(' ')[1];

      if (!apiKey) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized: API key missing in Authorization header',
        });
      }

      const cacheKey = `${API_KEY_CACHE_PREFIX}${apiKey}`;
      let verificationResult: Awaited<
        ReturnType<typeof auth.api.verifyApiKey>
      > | null = null;

      try {
        const cachedData = await redisRateLimitClient.get(cacheKey);
        if (cachedData) {
          verificationResult = JSON.parse(cachedData);
        }
      } catch (error) {
        console.error('Redis Cache GET Error:', error);
      }

      if (!verificationResult) {
        try {
          verificationResult = await auth.api.verifyApiKey({
            body: { key: apiKey },
          });

          try {
            await redisRateLimitClient.setex(
              cacheKey,
              API_KEY_CACHE_TTL_SECONDS,
              JSON.stringify(verificationResult),
            );
          } catch (error) {
            console.error('Redis Cache SETEX Error:', error);
          }
        } catch (error) {
          console.error('API Key Verification API Error:', error);
          if (error instanceof APIError) {
            const numericStatus =
              typeof error.status === 'number'
                ? error.status
                : Number.parseInt(error.status as string, 10);
            const finalStatus = !Number.isNaN(numericStatus)
              ? numericStatus
              : 500;

            return res.status(finalStatus).json({
              success: false,
              error: `Authentication API error: ${error.message}`,
            });
          }
          return res.status(500).json({
            success: false,
            error: 'Internal Server Error during API Key verification',
          });
        }
      }

      if (!verificationResult?.valid) {
        const errorMessage =
          verificationResult?.error?.message || 'Invalid API key';
        return res
          .status(401)
          .json({ success: false, error: `Unauthorized: ${errorMessage}` });
      }

      // Attach the verified API key details (excluding the key itself) to the request object
      // This makes userId, metadata, etc., available in subsequent handlers/controllers.
      (req as any).apiKeyDetails = verificationResult.key;

      const userId =
        verificationResult.key?.userId ||
        `api_key_user_${apiKey.substring(0, 8)}`;
      const plan = (verificationResult.key?.metadata as any)?.plan || 'free';
      const teamId = (verificationResult.key?.metadata as any)?.teamId;

      try {
        const rateLimiter = getRateLimiter(mode, apiKey, plan, teamId);

        await rateLimiter.consume(userId);

        return next();
      } catch (rateLimiterError) {
        if (
          typeof rateLimiterError === 'object' &&
          rateLimiterError !== null &&
          'msBeforeNext' in rateLimiterError &&
          typeof (rateLimiterError as any).msBeforeNext === 'number'
        ) {
          const msBeforeNext = (rateLimiterError as { msBeforeNext: number })
            .msBeforeNext;
          const retryAfter = Math.ceil(msBeforeNext / 1000);
          res.setHeader('Retry-After', String(retryAfter));
          return res.status(429).json({
            success: false,
            error: 'Too Many Requests. Please try again later.',
            retryAfterSeconds: retryAfter,
          });
        } else {
          console.error(
            'Rate Limiter Consume Error (unexpected format):',
            rateLimiterError,
          );
          return res.status(500).json({
            success: false,
            error: 'Internal Server Error during rate limiting check.',
          });
        }
      }
    })().catch((err) => {
      console.error('Unhandled error in apiKeyAuthMiddleware:', err);
      next(err);
    });
  };
}
