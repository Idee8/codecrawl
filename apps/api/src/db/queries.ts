import { and, desc, eq, gte } from 'drizzle-orm';
import { db } from '.';
import { llmsTxts } from './schema';

export async function getLlmsTxtByRepoUrl(repoUrl: string): Promise<any> {
  return await db
    .select()
    .from(llmsTxts)
    .where(eq(llmsTxts.repoUrl, repoUrl))
    .limit(1);
}

export async function getOrderedLlmsTxtByRepoUrl(
  repoUrl: string,
  maxUrls: number,
): Promise<any> {
  return await db
    .select()
    .from(llmsTxts)
    .where(and(gte(llmsTxts.maxUrls, maxUrls), eq(llmsTxts.repoUrl, repoUrl)))
    .orderBy(desc(llmsTxts.createdAt))
    .limit(1);
}
