import type { Request, Response } from 'express';
import { and, eq, sql } from 'drizzle-orm';

import { type ApiKey, apiKeys, teamMembers, teams } from '~/db/schema';
import { db } from '~/db';

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

export async function teamsController(req: Request, res: Response) {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ teams: [] });
  }

  const userTeams = await db
    .select({
      id: teams.id,
      name: teams.name,
      apiKeys: sql<ApiKey[]>`json_agg(${apiKeys})`.as('api_keys'),
    })
    .from(teamMembers)
    .innerJoin(teams, eq(teamMembers.teamId, teams.id))
    .innerJoin(apiKeys, eq(teams.id, apiKeys.teamId))
    .where(eq(teamMembers.userId, userId))
    .groupBy(teams.id, teams.name);

  return res.json(userTeams);
}
