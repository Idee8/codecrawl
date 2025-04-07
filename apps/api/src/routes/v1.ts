import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import expressWs from 'express-ws';

import { generateLLMsTextController } from '../controllers/v1/generate-llmstxt';
import { generateLLMsTextStatusController } from '../controllers/v1/generate-llmstxt-status';

expressWs(express());

export function wrap(
  controller: (req: Request, res: Response) => Promise<any>,
): (req: Request, res: Response, next: NextFunction) => any {
  return (req, res, next) => {
    controller(req, res).catch((err) => next(err));
  };
}

export const v1Router = express.Router();

v1Router.post('/llmstxt', wrap(generateLLMsTextController));
v1Router.get('/llmstxt/:jobId', wrap(generateLLMsTextStatusController));
