import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: varchar('full_name', { length: 100 }),
  email: varchar('email').notNull(),
  passwordHash: varchar('password_hash'),
  is_verified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});
