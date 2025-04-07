import type { Request, Response } from 'express';
import { saveGeneratedLlmsTxt } from '../../lib/generate-llms-txt/redis';
import { getGenerateLlmsTxtQueue } from '../../services/queue-service';

export type GenerateLLMsTextResponse = {
  success: boolean;
  id: string;
};

/**
 * Initiates a text generation job based on the provided Repo URL.
 * @param req - The request object containing authentication and generation parameters.
 * @param res - The response object to send the generation job ID.
 * @returns A promise that resolves when the generation job is queued.
 */
export async function generateLLMsTextController(req: Request, res: Response) {
  const generationId = crypto.randomUUID();
  const jobData = {
    request: req.body,
    teamId: '84594',
    plan: 'standard',
    subId: '43434',
    generationId,
  };

  await saveGeneratedLlmsTxt(generationId, {
    id: generationId,
    teamId: '84594',
    plan: 'standard',
    createdAt: Date.now(),
    status: 'processing',
    url: req.body.url,
    maxUrls: req.body.maxUrls,
    showFullText: req.body.showFullText,
    generatedText: '',
    fullText: '',
  });

  await getGenerateLlmsTxtQueue().add(generationId, jobData, {
    jobId: generationId,
  });

  return res.status(200).json({
    success: true,
    id: generationId,
  });
}
