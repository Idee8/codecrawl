import { type InferSelectModel, relations } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  boolean,
  index,
  uuid,
} from 'drizzle-orm/pg-core';

import { users } from './users';
import { teams } from './teams';

export const apiKeys = pgTable(
  'api_keys',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    key: varchar('key', { length: 255 }).notNull().unique(),
    userId: uuid('user_id')
      .references(() => users.id)
      .notNull(),
    teamId: uuid('team_id')
      .references(() => teams.id)
      .notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index('api_keys_user_id_idx').on(table.userId)],
);

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
}));

export type ApiKey = InferSelectModel<typeof apiKeys>;
