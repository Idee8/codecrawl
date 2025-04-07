import { eq } from 'drizzle-orm';
import { db } from '.';
import { llmsTxts } from './schema';

export interface LlmsTxt {
  repoUrl: string;
  llmstxt: string;
  llmstxtFull: string;
  maxUrls: number;
}

export async function updateLlmsTxtByRepoUrl({
  repoUrl,
  llmstxt,
  llmstxtFull,
  maxUrls,
}: LlmsTxt) {
  return await db
    .update(llmsTxts)
    .set({
      llmstxt,
      llmstxtFull,
      maxUrls,
    })
    .where(eq(llmsTxts.repoUrl, repoUrl));
}

export async function createLlmsTxt({
  llmstxt,
  llmstxtFull,
  maxUrls,
  repoUrl,
}: LlmsTxt) {
  return await db
    .insert(llmsTxts)
    .values({ llmstxt, repoUrl, llmstxtFull, maxUrls })
    .returning();
}
