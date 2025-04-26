import { eq } from 'drizzle-orm';
import type { Request, Response } from 'express';
import { z } from 'zod';

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

const createApiKeySchema = z.object({
  name: z.string(),
  teamId: z.string(),
});

export async function userCreateApiKeyController(
  req: Request<any, any, z.infer<typeof createApiKeySchema>>,
  res: Response,
) {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const apiKey = createApiKey();

  try {
    const { name, teamId } = createApiKeySchema.parse(req.body);

    const [key] = await db
      .insert(apiKeys)
      .values({
        key: apiKey,
        userId: userId as string,
        teamId,
        name,
      })
      .returning();
    return res.status(200).json({ key });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create API key' });
  }
}

const deleteApiKeySchema = z.object({
  keyId: z.string(),
});

export async function userDeleteApiKeyController(
  req: Request<any, any, z.infer<typeof deleteApiKeySchema>>,
  res: Response,
) {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { keyId } = deleteApiKeySchema.parse(req.body);

    await db.delete(apiKeys).where(eq(apiKeys.id, keyId));
    return res.status(200).json({ message: 'API key deleted', keyId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete API key' });
  }
}
