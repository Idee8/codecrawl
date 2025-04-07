import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const llmsTxts = pgTable('llms_txts', {
  id: uuid('id').primaryKey().defaultRandom(),
  repoUrl: text('repo_url').notNull(),
  llmstxt: text('llmstxt').notNull(),
  maxUrls: integer('max_urls').default(1),
  llmstxtFull: text('llmstxt_full'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
