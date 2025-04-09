import { betterAuth, logger } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, apiKey, openAPI, organization } from 'better-auth/plugins';
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

        if (newSession?.session && newSession.user) {
          let organizationIdToStore: string | null = null;
          try {
            const activeOrganizationId = (newSession.session as any)
              .activeOrganizationId;

            if (activeOrganizationId) {
              organizationIdToStore = activeOrganizationId;
            } else {
              logger.warn(
                `No activeOrganizationId found on session for user ${newSession.user.id}`,
              );
            }
          } catch (err) {
            logger.error(
              'Error getting activeOrganizationId during sign-up hook:',
              err,
            );
          }

          await auth.api.createApiKey({
            body: {
              name: 'Default',
              prefix: 'cocr-',
              userId: newSession.user.id,
              metadata: {
                plan: 'free',
                teamId: organizationIdToStore,
              },
            },
          });
        }
      }
    }),
  },
  plugins: [
    apiKey({
      enableMetadata: true,
    }),
    openAPI({
      disableDefaultReference: process.env.NODE_ENV === 'production',
    }),
    admin(),
    organization(),
  ],
});
