import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { AbstractRedis } from 'src/lib';

@Injectable()
export class RedisService extends AbstractRedis {
  constructor() {
    super(new Redis(process.env.REDIS_HEIMDALL_HOST ?? 'redis://localhost:6379'))
  }
  
  async onModuleInit() {
    // console.info('Redis connected depuis Heimdall');
  }
}