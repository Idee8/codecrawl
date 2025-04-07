import { and, eq, gte } from 'drizzle-orm';
import { db } from '.';
import { llmsTxts } from './schema';

export async function getLlmsTxtByRepoUrl(repoUrl: string) {
  return await db
    .select()
    .from(llmsTxts)
    .where(eq(llmsTxts.repoUrl, repoUrl))
    .limit(1);
}

export async function getOrderedLlmsTxtByRepoUrl(
  repoUrl: string,
  maxUrls: number,
) {
  return await db
    .select()
    .from(llmsTxts)
    .where(and(gte(llmsTxts.maxUrls, maxUrls), eq(llmsTxts.repoUrl, repoUrl)))
    .limit(1);
}
