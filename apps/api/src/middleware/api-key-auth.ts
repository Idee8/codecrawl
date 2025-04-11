import type { Request, Response, NextFunction } from 'express';

import { validateApiKey } from '../services/api-keys-service';
import { redisRateLimitClient, getRateLimiter } from '../services/rate-limiter';
import type { RateLimiterMode } from '../types';
import { logger } from '../lib/logger';

const API_KEY_CACHE_PREFIX = 'apiKeyCache:';
const API_KEY_CACHE_TTL_SECONDS = 300;

export interface AuthenticatedApiKeyDetails {
  id: string;
  userId: string;
  teamId: string | null;
}

declare global {
  namespace Express {
    interface Request {
      apiKeyDetails?: AuthenticatedApiKeyDetails;
    }
  }
}

export const apiKeyAuthMiddleware = (
  mode: RateLimiterMode,
): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization as string;

      if (!authHeader) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized: API key missing',
        });
        return;
      }

      const apiKey = authHeader.split(' ')[1];

      if (!apiKey) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized: API key missing',
        });
        return;
      }

      const cacheKey = `${API_KEY_CACHE_PREFIX}${apiKey}`;
      let validatedKeyDetails: AuthenticatedApiKeyDetails | null | undefined =
        undefined;

      try {
        const cachedData = await redisRateLimitClient.get(cacheKey);

        if (cachedData) {
          validatedKeyDetails = JSON.parse(
            cachedData,
          ) as AuthenticatedApiKeyDetails;
        }
      } catch (error) {
        logger.error('Redis Cache GET Error during API key auth:', error);
      }

      if (validatedKeyDetails === undefined) {
        try {
          const validationResult = await validateApiKey(apiKey);
          if (validationResult) {
            validatedKeyDetails = {
              id: validationResult.id,
              userId: validationResult.userId,
              teamId: validationResult.teamId,
            };

            redisRateLimitClient
              .setex(
                cacheKey,
                API_KEY_CACHE_TTL_SECONDS,
                JSON.stringify(validatedKeyDetails),
              )
              .catch((err) => {
                logger.error(
                  'Redis Cache SETEX Error during API key auth:',
                  err,
                );
              });
          } else {
            validatedKeyDetails = null;
          }
        } catch (error) {
          logger.error('Error calling validateApiKey:', error);
          res.status(500).json({
            success: false,
            error: 'Internal Server Error',
          });
          return;
        }
      }

      // Handle invalid key (either from cache or direct validation)
      if (!validatedKeyDetails) {
        res
          .status(401)
          .json({ success: false, error: 'Unauthorized: Invalid API key' });
        return;
      }

      try {
        const { userId } = validatedKeyDetails;
        const rateLimiter = getRateLimiter(mode, apiKey);

        await rateLimiter.consume(userId);
      } catch (rateLimiterError: any) {
        if (
          typeof rateLimiterError === 'object' &&
          rateLimiterError !== null &&
          'msBeforeNext' in rateLimiterError
        ) {
          const msBeforeNext = Number(rateLimiterError.msBeforeNext);
          const retryAfter = Math.ceil(msBeforeNext / 1000);
          res.setHeader('Retry-After', String(retryAfter));
          res.status(429).json({
            success: false,
            error: 'Too Many Requests',
            retryAfterSeconds: retryAfter,
          });
        } else {
          logger.error(
            'Unexpected Rate Limiter Consume Error:',
            rateLimiterError,
          );
          res.status(500).json({
            success: false,
            error: 'Internal Server Error.',
          });
        }
        return;
      }

      req.apiKeyDetails = validatedKeyDetails;

      next();
    } catch (error) {
      logger.error('Internal server error in apiKeyAuthMiddleware:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
      });
    }
  };
};
