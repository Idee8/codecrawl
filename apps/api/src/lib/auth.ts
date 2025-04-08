import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, apiKey, openAPI } from 'better-auth/plugins';
import { createAuthMiddleware } from 'better-auth/api';

import { db } from '../db';
import * as schema from '../db/schema/auth-schema';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith('/sign-up')) {
        const newSession = ctx.context.newSession;
        if (newSession) {
          await fetch('/api/auth/api-key/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: 'Default',
              userId: newSession.user.id,
            }),
          });
        }
      }
    }),
  },
  plugins: [
    apiKey(),
    openAPI({
      disableDefaultReference: process.env.NODE_ENV === 'production',
    }),
    admin(),
  ],
});
