import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

/**
 * Abstract base class for Redis integration in NestJS modules.
 * 
 * Implements lifecycle hooks:
 * - `onModuleInit`: called when the module is initialized.
 * - `onModuleDestroy`: called when the module is destroyed.
 *
 * Provides access to the Redis client instance.
 */
export abstract class AbstractRedis implements OnModuleInit, OnModuleDestroy {
  /**
   * @param ioredis - The Redis client instance (ioredis)
   */
  constructor(protected ioredis : Redis) {
    
  }


  /**
   * Lifecycle hook executed when the module is initialized.
   * Can be overridden by subclasses if needed.
   */
  async onModuleInit() {
    // console.log("Redis init");
  }

  /**
   * Lifecycle hook executed when the module is destroyed.
   * Ensures the Redis connection is properly closed.
   */
  async onModuleDestroy() {
    await this.redis.quit();
  }

  /**
   * Provides direct access to the underlying Redis client.
   */
  get redis(): Redis {
    return this.ioredis;
  }

  /**
   * Returns the Redis client instance.
   * Alias for `this.redis`, included for readability.
   */
  getClient(): Redis {
    return this.redis;
  }



  /**
   * Stores a JSON-serializable value in Redis under the given key.
   * Optionally applies a TTL (time-to-live).
   *
   * @param key - Redis key
   * @param value - Value to store (will be JSON.stringified)
   * @param ttlSeconds - Optional TTL in seconds (if > 0, sets expiration)
   */
  async setJSON(key: string, value: unknown, ttlSeconds?: number) {
    const payload = JSON.stringify(value);
    if (ttlSeconds && ttlSeconds > 0) {
      await this.redis.set(key, payload, 'EX', ttlSeconds);
    } else {
      await this.redis.set(key, payload);
    }
  }

  /**
   * Retrieves and parses a JSON value from Redis.
   *
   * @param key - Redis key
   * @returns The parsed value, or null if the key does not exist
   */
  async getJSON<T = any>(key: string): Promise<T | null> {
    const raw = await this.redis.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  /**
   * Deletes a key from Redis.
   *
   * @param key - Redis key
   */
  async del(key: string) {
    await this.redis.del(key);
  }

  /**
   * Sets a value in Redis only if the key does not already exist (NX option).
   * Automatically sets an expiration time (EX).
   *
   * @param key - Redis key
   * @param value - Value to store
   * @param ttlSeconds - Time-to-live in seconds
   */
  async setNX(key: string, value: string, ttlSeconds: number) {
    await this.redis.set(key, value, 'EX', ttlSeconds, 'NX');
  }
}