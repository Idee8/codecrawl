import jwt from 'jsonwebtoken';
import type { User } from '../db/schema';

export interface AccessTokenPayload {
  userId: string;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number | null;
}

export const generateAccessToken = (user: User): string => {
  const payload: AccessTokenPayload = {
    userId: user.id,
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '15min',
  });
};

export const generateRefreshToken = (
  user: User,
  currentTokenVersion: number | null,
): string => {
  const payload: RefreshTokenPayload = {
    userId: user.id,
    tokenVersion: currentTokenVersion,
  };

  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: '7d',
  });
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const decoded = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
  ) as AccessTokenPayload;

  if (typeof decoded.userId !== 'string') {
    throw new jwt.JsonWebTokenError('Invalid access token payload structure');
  }

  return decoded;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  const decoded = jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET as string,
  ) as RefreshTokenPayload;

  if (typeof decoded.userId !== 'string') {
    throw new jwt.JsonWebTokenError('Invalid refresh token payload structure');
  }
  return decoded;
};

export const createTokens = (user: User) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, user.tokenVersion);
  return { accessToken, refreshToken };
};
