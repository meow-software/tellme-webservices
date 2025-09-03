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
   * @param _redis - The Redis client instance (ioredis)
   */
  constructor(protected _redis: Redis) {}

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
    return this._redis;
  }

  /**
   * Returns the Redis client instance.
   * Alias for `this.redis`, included for readability.
   */
  getClient(): Redis {
    return this.redis;
  }
}
