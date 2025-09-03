import { Injectable, OnModuleDestroy, Inject } from '@nestjs/common';
import { IEventBus } from '@tellme/ws-core';
import { AbstractRedis } from '@tellme/ws-core';
import { Redis } from 'ioredis';
import { REDIS_SERVICE  } from './event-bus.module';

/**
 * Redis-based implementation of an event bus.
 *
 * Allows publishing and subscribing to events using Redis Pub/Sub.
 * Intended for inter-service communication or lightweight messaging.
 *
 */
@Injectable()
export class RedisEventBus implements IEventBus, OnModuleDestroy {
    /** Whether the subscriber has been initialized */
    private subscriberInitialized = false;

    /** Direct access to Redis client */
    protected redis;

    /**
     * @param redisService - An instance of AbstractRedis
     */
    constructor(@Inject(REDIS_SERVICE) private readonly redisService: AbstractRedis) {
        this.redis = redisService.redis;
    }

    /**
     * Publishes an event to a given Redis topic.
     *
     * @param topic - Redis channel name
     * @param message - Message payload (will be JSON.stringified)
     */
    async publish(topic: string, message: any) {
        const payload = JSON.stringify({
            event: topic,
            timestamp: new Date().toISOString(),
            payload: message,
        });
        await this.redis.publish(topic, payload);
    }

    /**
     * Subscribes to a Redis topic and listens for messages.
     * Executes the provided handler when a message is received.
     *
     * Useful for local development.  
     * In production, prefer dedicated services/consumers.
     *
     * @param topic - Redis channel name
     * @param handler - Callback executed with parsed message payload
     */
    async subscribe(topic: string, handler: (message: any) => void) {
        if (!this.subscriberInitialized) {
            this.subscriberInitialized = true;
        }
        const sub = this.redis.getSubscriber();

        // Subscribe to the topic
        await sub.subscribe(topic);

        // Listen to messages and route them to the handler
        sub.on('message', (channel: string, msg: string) => {
            if (channel === topic) {
                try {
                    const parsed = JSON.parse(msg);
                    handler(parsed);
                } catch (e) {
                    console.error('Failed parsing event', e);
                }
            }
        });
    }

    /**
     * Lifecycle hook executed when the module is destroyed.
     * Ensures Redis connection is properly closed.
     */
    async onModuleDestroy() {
        await this.redisService.onModuleDestroy();
    }
}
