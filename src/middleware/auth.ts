import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  apiKey?: string;
  agentId?: string;
}

/**
 * API Key authentication middleware
 * Expects header: X-API-Key: <key>
 */
export function apiKeyAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Missing X-API-Key header'
    });
    return;
  }

  // TODO: Validate API key against database
  // For now, just pass through for development
  req.apiKey = apiKey;
  
  next();
}

/**
 * Optional auth - doesn't fail if no key provided
 */
export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'] as string;
  if (apiKey) {
    req.apiKey = apiKey;
  }
  next();
}
