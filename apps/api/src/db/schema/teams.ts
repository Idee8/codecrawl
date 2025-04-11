import { pgTable, uuid, varchar, timestamp, index } from 'drizzle-orm/pg-core';
import type { InferSelectModel } from 'drizzle-orm';

import { users } from './users';

export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const teamMembers = pgTable(
  'team_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    teamId: uuid('team_id')
      .references(() => teams.id)
      .notNull(),
    userId: uuid('user_id')
      .references(() => users.id)
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('team_members_team_id_idx').on(table.teamId),
    index('team_members_user_id_idx').on(table.userId),
  ],
);

export type Team = InferSelectModel<typeof teams>;
export type TeamMember = InferSelectModel<typeof teamMembers>;
