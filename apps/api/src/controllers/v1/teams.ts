import type { Request, Response } from 'express';
import { and, eq } from 'drizzle-orm';

import { apiKeys, teamMembers } from '../../db/schema';
import { db } from '../../db';

export async function teamKeysController(req: Request, res: Response) {
  const userId = req.userId;
  const teamId = req.params.teamId;

  if (!userId || !teamId) {
    return res.status(401).json({ keys: [] });
  }

  const [team] = await db
    .select()
    .from(teamMembers)
    .where(and(eq(teamMembers.userId, userId), eq(teamMembers.teamId, teamId)));

  if (!team) {
    return res.status(401).json({ keys: [] });
  }

  const keys = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.teamId, team.teamId));

  return res.json({ keys });
}
