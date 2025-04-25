import { randomUUID } from 'node:crypto';
import type { Request, Response } from 'express';

import { getGenerateTreeQueue } from '~/services/queue-service';
import { saveTreeGenerationData } from '~/lib/generate-tree';

interface GenerateTreeRequest {
  url: string;
}

export async function generateTreeController(
  req: Request<any, any, GenerateTreeRequest>,
  res: Response,
) {
  const userId = req.apiKeyDetails?.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  const generationId = randomUUID();
  const jobData = {
    url: req.body.url,
    userId,
    generationId,
  };

  await saveTreeGenerationData({
    id: generationId,
    userId,
    createdAt: Date.now(),
    status: 'processing',
    url: req.body.url,
    fileTree: '',
  });

  await getGenerateTreeQueue().add(generationId, jobData, {
    jobId: generationId,
  });

  return res.status(200).json({
    success: true,
    id: generationId,
  });
}
