import { eq } from 'drizzle-orm';
import type { Request, Response } from 'express';

import { db } from '../../db';
import { apiKeys, users } from '../../db/schema';

export async function userMeController(req: Request, res: Response) {
  const userId = req.userId;

  if (!userId) {
    return res.status(200).json({ user: null });
  }
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  return res.status(200).json({ user: user });
}

export async function userApiKeysController(req: Request, res: Response) {
  const userId = req.userId;

  if (!userId) {
    return res.status(200).json({ keys: [] });
  }

  const keys = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.userId, userId));
  return res.status(200).json({ keys });
}
