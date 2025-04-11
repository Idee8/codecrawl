import { eq } from 'drizzle-orm';
import argon2 from 'argon2';
import type { Request, Response } from 'express';

import { db } from '../../db';
import { apiKeys, teams, users } from '../../db/schema';
import { createTokens } from '../../services/jwt-service';
import { createApiKey } from '../../services/api-keys-service';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  const isPasswordValid = await argon2.verify(
    user.hashedPassword as string,
    password,
  );

  if (!isPasswordValid) {
    return res.status(400).json({ error: 'Invalid password' });
  }

  const tokens = createTokens(user);

  return res.status(200).json({
    success: true,
    tokens,
  });
};

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (user) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await argon2.hash(password);

  user = await db.transaction(async (tx) => {
    const apiKey = createApiKey();

    const [team] = await tx
      .insert(teams)
      .values({
        name: 'Person Team  ',
      })
      .returning();

    const [u] = await tx
      .insert(users)
      .values({
        email,
        hashedPassword,
      })
      .returning();

    await tx.insert(apiKeys).values({
      key: apiKey,
      userId: u?.id as string,
      teamId: team?.id as string,
      name: 'Default',
    });

    return u;
  });

  if (!user) {
    return res.json({ error: 'Internal Server Errror' }).status(500);
  }

  const tokens = createTokens(user);

  return res.status(201).json({
    success: true,
    tokens,
  });
};
