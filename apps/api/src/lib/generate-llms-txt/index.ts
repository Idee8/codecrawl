import { z } from 'zod';

import type { PlanType } from '../../types';
import { createLlmsTxt, updateLlmsTxtByRepoUrl } from '../../db/mutations';
import {
  getLlmsTxtByRepoUrl,
  getOrderedLlmsTxtByRepoUrl,
} from '../../db/queries';
import { logger as _logger } from '../logger';
import { updateGeneratedLlmsTxt } from './redis';
import { runRemoteAction } from '../../core/actions/remoteAction';

interface LlmsTextCache {
  repoUrl: string;
  llmstxt: string;
  llmstxt_full: string;
  maxUrls: number;
}

export async function getLlmsTextFromCache(
  url: string,
  maxUrls: number,
): Promise<LlmsTextCache | null> {
  try {
    const [data] = await getOrderedLlmsTxtByRepoUrl(url, maxUrls);

    // Check if data is older than 1 week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    if (!data || new Date(data.updatedAt as Date) < oneWeekAgo) {
      return null;
    }

    return data;
  } catch (error) {
    _logger.error('Failed to fetch LLMs text from cache', { error, url });
    return null;
  }
}

export async function saveLlmsTextCache(
  url: string,
  llmstxt: string,
  llmstxtFull: string,
  maxUrls: number,
): Promise<void> {
  try {
    const [existingData] = await getLlmsTxtByRepoUrl(url);

    if (existingData) {
      // Update existing entry
      try {
        await updateLlmsTxtByRepoUrl({
          repoUrl: url,
          llmstxt,
          llmstxtFull,
          maxUrls,
        });
        _logger.debug('Successfully updated cached LLMs text', {
          url,
          maxUrls,
        });
      } catch (error) {
        _logger.error('Error updating LLMs text in cache', { error, url });
      }
    } else {
      // Insert new entry
      try {
        await createLlmsTxt({
          repoUrl: url,
          llmstxt,
          llmstxtFull,
          maxUrls,
        });
        _logger.debug('Successfully inserted new cached LLMs text', {
          url,
          maxUrls,
        });
      } catch (error) {
        _logger.error('Error inserting LLMs text to cache', { error, url });
      }
    }
  } catch (error) {
    _logger.error('Failed to save LLMs text to cache', { error, url });
  }
}

/**
 * Services
 */

interface GenerateLLMsTextServiceOptions {
  generationId: string;
  teamId: string;
  plan: PlanType;
  url: string;
  maxUrls: number;
  showFullText: boolean;
  subId?: string;
}

const descriptionSchema = z.object({
  description: z.string(),
  title: z.string(),
});

export async function performGenerateLlmsTxt(
  options: GenerateLLMsTextServiceOptions,
) {
  const { generationId, maxUrls, plan, showFullText, teamId, url, subId } =
    options;

  const startTime = Date.now();
  const logger = _logger.child({
    module: 'generate-llmstxt',
    method: 'performGenerateLlmsTxt',
    generationId,
    teamId,
  });

  try {
    // Enforce max URL limit
    const effectiveMaxUrls = Math.min(maxUrls, 5000);

    // Check cache first
    const cachedResult = await getLlmsTextFromCache(url, effectiveMaxUrls);

    if (cachedResult) {
      logger.info('Found cached LLMs text', { url });

      // TODO: Limit content and remove separators before returning

      // TODO: Limit llmstxt entries to match maxUrls

      // Update final result with cached text
      await updateGeneratedLlmsTxt(generationId, {
        status: 'completed',
        generatedText: cachedResult.llmstxt,
        fullText: cachedResult.llmstxt_full,
        showFullText: showFullText,
      });

      return {
        success: true,
        data: {
          generatedText: cachedResult.llmstxt,
          fullText: cachedResult.llmstxt_full,
          showFullText: showFullText,
        },
      };
    }

    const results = await runRemoteAction(url, { remote: url });

    if (!results || !results.packResult) {
      logger.error(`Failed to scrape URL ${url}`);
      return null;
    }

    return {
      url: url,
      markdown: results.packResult.output,
    };
  } catch (error) {
    logger.error('Generate LLMs text error', { error });

    await updateGeneratedLlmsTxt(generationId, {
      status: 'failed',
      error: error.message || 'Unknown error occurred',
    });

    throw error;
  }
}
