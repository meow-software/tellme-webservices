
/**
 * Normalizes environment variable values by converting escaped newlines (\n) to actual newlines.
 * This is useful for reading multi-line keys (like RSA private keys) from .env files.
 * 
 * @param {string | undefined} key - The environment variable value to normalize
 * @returns {string} Normalized string with actual newline characters
 * 
 * @example
 * // Input: "-----BEGIN PRIVATE KEY-----\\nMII...\\n-----END PRIVATE KEY-----"
 * // Output: "-----BEGIN PRIVATE KEY-----\nMII...\n-----END PRIVATE KEY-----"
 */
export function normalizeKeyFromEnv(key: string | undefined): string {
    if (!key) return '';
    return key.replace(/\\n/g, '\n'); // Convert escaped newlines to actual newlines
}