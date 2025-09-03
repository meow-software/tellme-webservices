import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { AbstractRedis } from 'src/lib';

@Injectable()
export class AtlasRedisService extends AbstractRedis {
  constructor() {
    super(new Redis(process.env.REDIS_ATLAS_HOST ?? 'redis://localhost:6379'))
  }
}
