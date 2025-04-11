import type { NextFunction, Request, Response } from 'express';

export function wrap<Req extends Request = Request>(
  controller: (req: Req, res: Response) => Promise<any>,
): (req: Req, res: Response, next: NextFunction) => any {
  return (req, res, next) => {
    controller(req, res).catch((err) => next(err));
  };
}

export * from './api-key-auth';
export * from './jwt-auth';
