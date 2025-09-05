export * from './proxy/index';
export * from './event-bus/index';
export * from './dto/index';
export * from './constants/index';

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}