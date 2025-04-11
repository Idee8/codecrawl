import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  integer,
  uuid,
  index,
  text,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    hashedPassword: text('hashed_password'),
    googleId: varchar('google_id', { length: 255 }),
    githubId: varchar('github_id', { length: 255 }),
    tokenVersion: integer('token_version').default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [index('users_email_idx').on(table.email)],
);

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
