import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { SCRIPT_REDIS_REPLACE_BOT_SESSION } from './lua';
import { AbstractRedis } from '@tellme/ws-core';

@Injectable()
export class RedisService extends AbstractRedis {
  protected SCRIPT_REDIS_REPLACE_BOT_SESSION;
  constructor() {
    super(new Redis(process.env.REDIS_CERBERUS_HOST ?? 'redis://localhost:6379'))
  }

  async onModuleInit() {
    this.SCRIPT_REDIS_REPLACE_BOT_SESSION = await this.redis.script('LOAD', SCRIPT_REDIS_REPLACE_BOT_SESSION);
  }

  async replaceBotSession(clientType: string, id: string, jti: string, ttl: number) {
    return await this.getClient().evalsha(this.SCRIPT_REDIS_REPLACE_BOT_SESSION, 0, clientType, id, jti, ttl.toString());
  }
}
