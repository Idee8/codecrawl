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

// Represents the details attached to the request by apiKeyAuthMiddleware
// Based on Omit<ApiKey, "key"> from Better Auth
export type ApiKeyDetails = {
  id: string;
  userId: string | null; // Assuming userId might be null if key isn't user-associated
  name: string | null;
  enabled: boolean;
  metadata: Record<string, any> | null; // Or a more specific type if known
  createdAt: Date | string; // Adjust type based on actual data
  updatedAt: Date | string; // Adjust type based on actual data
  expiresAt: Date | string | null;
  // Add other relevant fields from ApiKey type if needed (e.g., permissions, rateLimit details)
} | null; // The key can be null if verification fails, though middleware handles this

// Interface for Express requests authenticated via API Key
export interface RequestWithApiKey<ReqParams = {}, ResBody = undefined>
  extends Request<
    ReqParams,
    ResBody,
    undefined /* ReqBody set to undefined */
  > {
  apiKeyDetails?: ApiKeyDetails; // Make it optional as it's added dynamically
}
