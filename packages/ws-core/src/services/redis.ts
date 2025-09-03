import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

/**
 * Abstract base class for Redis integration in NestJS modules.
 * 
 * Implements lifecycle hooks:
 * - `onModuleInit`: called when the module is initialized.
 * - `onModuleDestroy`: called when the module is destroyed.
 *
 * Provides access to the Redis client instance, a subscriber for Pub/Sub,
 * and helper methods to publish or listen for messages.
 */
export abstract class AbstractRedis implements OnModuleInit, OnModuleDestroy {
  /**
   * @param subscriber - The Redis client instance use for subscribing to pub/sub channels
   */
  protected subscriber: Redis;
  
  /**
   * @param client - The main Redis client instance (client) use for commands
   */
  constructor(protected client: Redis) {
    // Init subscriber
    this.subscriber = new Redis(client.options);
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
    await this.client.quit();
    await this.subscriber.quit();
  }

  /**
   * Provides direct access to the underlying Redis client.
   */
  get redis(): Redis {
    return this.client;
  }

  /**
   * Returns the Redis client instance.
   * Alias for `this.redis`, included for readability.
   */
  getClient(): Redis {
    return this.redis;
  }


  /**
   * Returns the Redis client used for subscriptions.
   *
   * @returns Redis client for subscribing to channels
   */
  getSubscriber(): Redis {
    return this.subscriber;
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
      await this.client.set(key, payload, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, payload);
    }
  }

  /**
   * Retrieves and parses a JSON value from Redis.
   *
   * @param key - Redis key
   * @returns The parsed value, or null if the key does not exist
   */
  async getJSON<T = any>(key: string): Promise<T | null> {
    const raw = await this.client.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  /**
   * Deletes a key from Redis.
   *
   * @param key - Redis key
   */
  async del(key: string) {
    await this.client.del(key);
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
    await this.client.set(key, value, 'EX', ttlSeconds, 'NX');
  }

  /**
   * Publishes a message to a Redis channel.
   *
   * @param channel - Name of the Redis channel
   * @param message - Message payload as a string
   */
  async publish(channel: string, message: string) {
    await this.client.publish(channel, message);
  }

  /**
   * Registers a callback for messages received on subscribed channels.
   *
   * @param callback - Function called with channel and message when a message is received
   */
  onMessage(callback: (channel: string, message: string) => void) {
    this.subscriber.on('message', callback);
  }
}