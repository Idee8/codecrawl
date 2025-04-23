import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { eq } from 'drizzle-orm';
import { verify } from 'jsonwebtoken';

import {
  createTokens,
  type AccessTokenPayload,
  type RefreshTokenPayload,
} from '../services/jwt-service';
import { db } from '../db';
import { users } from '../db/schema';

export const authMiddleware: (st?: boolean) => RequestHandler =
  (shouldThrow = true) =>
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const accessToken = req.headers['x-access-token'] as string;
    const refreshToken = req.headers['x-refresh-token'] as string;

    if (!accessToken || !refreshToken) {
      if (shouldThrow) {
        return res.status(401).json({ error: 'Not authorized: Missing token' });
      }
      return next();
    }

    try {
      const payload = verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as string,
      ) as AccessTokenPayload;

      (req as any).userId = payload.userId;

      return next();
    } catch {}

    let data: RefreshTokenPayload;
    try {
      data = verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string,
      ) as RefreshTokenPayload;
    } catch {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, data.userId),
    });

    if (!user || user.tokenVersion !== data.tokenVersion) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const tokens = createTokens(user);
    res.setHeader('access-token', tokens.accessToken);
    res.setHeader('refresh-token', tokens.refreshToken);

    (req as any).userId = user.id;

    return next();
  };
