import type { Request, Response } from 'express';

import {
  getTreeGenerationData,
  getTreeGenerationDataExpiry,
} from '~/lib/generate-tree';

interface StatusParams {
  jobId: string;
}

export async function generateTreeStatusController(
  req: Request<StatusParams, any, any>,
  res: Response,
) {
  const generationId = req.params.jobId;
  const generation = await getTreeGenerationData(generationId);

  if (!generation) {
    return res.status(404).json({
      success: false,
      error: 'tree generation job not found',
    });
  }

  console.log('generation', generation);

  return res.status(200).json({
    success: generation.status !== 'failed',
    data: {
      tree: generation.fileTree,
    },
    status: generation.status,
    error: generation?.error ?? undefined,
    expiresAt: (await getTreeGenerationDataExpiry(generationId)).toISOString(),
  });
}
