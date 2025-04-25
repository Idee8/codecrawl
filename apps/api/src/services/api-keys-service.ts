import crypto from 'node:crypto';
import { eq, desc } from 'drizzle-orm';

import { db } from '~/db';
import { type ApiKey, apiKeys } from '~/db/schema';

const API_KEY_BYTE_LENGTH = 32;

export const createApiKey = (): string => {
  const plainKey = `cc_${crypto
    .randomBytes(API_KEY_BYTE_LENGTH)
    .toString('hex')}`;

  return plainKey;
};

export const validateApiKey = async (
  providedKey: string,
): Promise<Omit<ApiKey, 'key'> | null> => {
  if (!providedKey) {
    return null;
  }

  try {
    const [potentialKey] = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.key, providedKey))
      .limit(1);

    if (!potentialKey || !potentialKey.isActive) {
      return null;
    }

    const { key: _, ...keyDetails } = potentialKey;
    return keyDetails;
  } catch (error) {
    console.error('Error validating API key:', error);
    return null;
  }
};

export const listApiKeysForUser = async (
  userId: string,
): Promise<Omit<any, 'key'>[]> => {
  try {
    const keys = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.userId, userId))
      .orderBy(desc(apiKeys.createdAt));

    return keys;
  } catch (error) {
    console.error('Error listing API keys:', error);
    return [];
  }
};
