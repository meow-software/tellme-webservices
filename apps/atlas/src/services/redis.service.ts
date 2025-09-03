import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    public client: Redis;
    private subscriber: Redis;

    constructor() {
        this.client = new Redis(process.env.REDIS_ATLAS_HOST || 'redis://localhost:6379');
        this.subscriber = new Redis(process.env.REDIS_ATLAS_HOST || 'redis://localhost:6379');
    }

    getSubscriber(): Redis {
        return this.subscriber;
    }

    async get(key: string) { return this.client.get(key); }
    async set(key: string, value: string, ttlSec?: number) {
        if (ttlSec) await this.client.set(key, value, 'EX', ttlSec);
        else await this.client.set(key, value);
    }
    async del(key: string) { return this.client.del(key); }
    async publish(channel: string, message: string) { return this.client.publish(channel, message); }
    async disconnect() { await this.client.quit(); await this.subscriber.quit(); }
}
