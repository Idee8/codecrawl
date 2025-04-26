import { eq } from 'drizzle-orm';
import type { Request, Response } from 'express';

import { db } from '../../db';
import { apiKeys, users } from '../../db/schema';
import { createApiKey } from '../../services/api-keys-service';

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

export async function userCreateApiKeyController(
  req: Request<any, any, { name: string; teamId: string }>,
  res: Response,
) {
  const userId = req.userId;

  const apiKey = createApiKey();

  try {
    const [key] = await db
      .insert(apiKeys)
      .values({
        key: apiKey,
        userId: userId as string,
        teamId: req.body.teamId,
        name: req.body.name,
      })
      .returning();
    return res.status(200).json({ key });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create API key' });
  }
}

export async function userDeleteApiKeyController(
  req: Request<any, any, { keyId: string }>,
  res: Response,
) {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await db.delete(apiKeys).where(eq(apiKeys.id, req.body.keyId));
  return res
    .status(200)
    .json({ message: 'API key deleted', keyId: req.body.keyId });
}
