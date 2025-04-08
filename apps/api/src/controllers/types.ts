import type { Request } from 'express';
import type { auth } from '../lib/auth';

export type Session = typeof auth.$Infer.Session;

export interface RequestWithSession<
  ReqParams = {},
  ReqBody = undefined,
  ResBody = undefined,
> extends Request<ReqParams, ReqBody, ResBody> {
  session: Session;
}
