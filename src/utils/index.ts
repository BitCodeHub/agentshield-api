import crypto from 'crypto';

/**
 * Generate a secure API key
 */
export function generateApiKey(prefix: string = 'as'): string {
  const key = crypto.randomBytes(32).toString('base64url');
  return `${prefix}_${key}`;
}

/**
 * Hash an API key for storage
 */
export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

/**
 * Validate UUID format
 */
export function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
