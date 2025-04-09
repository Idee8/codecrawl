import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';

import type { PlanType, RateLimiterMode } from '../types';

export const CONCURRENCY_LIMIT: Omit<Record<PlanType, number>, ''> = {
  free: 2,
  hobby: 5,
  growth: 100,
  scale: 500,
  standard: 50,
};

const RATE_LIMITS = {
  crawl: {
    default: 15,
    free: 5,
    standard: 25,
    scale: 250,
    hobby: 15,
    growth: 250,
  },
  crawlStatus: {
    free: 500,
    default: 25000,
  },
  search: {
    default: 100,
    free: 5,
    standard: 250,
    scale: 2500,
    hobby: 50,
    growth: 2500,
  },
  account: {
    free: 100,
    default: 500,
  },
  testSuite: {
    free: 10000,
    default: 50000,
  },
};

export const redisRateLimitClient = new Redis(
  process.env.REDIS_RATE_LIMIT_URL as string,
);

const createRateLimiter = (keyPrefix?: string, points?: number) =>
  new RateLimiterRedis({
    storeClient: redisRateLimitClient,
    keyPrefix,
    points,
    duration: 60, // duration in seconds
  });

export const serverRateLimiter = createRateLimiter(
  'server',
  RATE_LIMITS.account.default,
);

export const testSuiteRateLimiter = new RateLimiterRedis({
  storeClient: redisRateLimitClient,
  keyPrefix: 'test-suite',
  points: 100,
});

function makePlanKey(plan?: string) {
  return plan ? plan.replace('-', '') : 'default';
}

export function getRateLimiterPoints(
  mode: RateLimiterMode,
  _token?: string,
  plan?: string,
  _teamId?: string,
) {
  const rateLimitConfig = RATE_LIMITS[mode];

  if (!rateLimitConfig) return RATE_LIMITS.account.default;

  const points: number =
    rateLimitConfig[makePlanKey(plan) || rateLimitConfig.default];

  return points;
}

export function getRateLimiter(
  mode: RateLimiterMode,
  token?: string,
  plan?: string,
  teamId?: string,
): RateLimiterRedis {
  return createRateLimiter(
    `${mode}-${makePlanKey(plan)}`,
    getRateLimiterPoints(mode, token, plan, teamId),
  );
}

export function getConcurrencyLimitMax(
  plan: PlanType,
  _teamId?: string,
): number {
  return CONCURRENCY_LIMIT[plan] ?? 10;
}
