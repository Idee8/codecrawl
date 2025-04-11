import type { Request, Response } from 'express';
import {
  getGeneratedLLmsTxt,
  getGeneratedLlmsTxtExpiry,
} from '../../lib/generate-llms-txt/redis';

interface StatusParams {
  jobId: string;
}

export async function generateLLMsTextStatusController(
  req: Request<StatusParams, any>,
  res: Response,
) {
  const generation = await getGeneratedLLmsTxt(req.params.jobId);
  const showFullText = generation?.showFullText ?? false;

  if (!generation) {
    return res.status(404).json({
      success: false,
      error: 'llmsTxt generation job not found',
    });
  }

  let data: any = null;

  if (showFullText) {
    data = {
      llmstxt: generation.generatedText,
      llmsfulltxt: generation.fullText,
    };
  } else {
    data = {
      llmstxt: generation.generatedText,
    };
  }

  return res.status(200).json({
    success: generation.status !== 'failed',
    data: data,
    status: generation.status,
    error: generation?.error ?? undefined,
    expiresAt: (
      await getGeneratedLlmsTxtExpiry(req.params.jobId)
    ).toISOString(),
  });
}
