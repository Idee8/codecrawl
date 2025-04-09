import type { Request, Response } from 'express';

export async function livenessController(_req: Request, res: Response) {
  return res.status(200).json({ status: 'OK' });
}
