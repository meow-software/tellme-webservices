
import { Module } from '@nestjs/common';
import { RedisEventBus } from './redis-event-bus';
import { RedisService } from 'src/services/redis.service';

export const EVENT_BUS = Symbol('EVENT_BUS');

@Module({
  providers: [
    {
      provide: EVENT_BUS, 
      useClass: RedisEventBus,
    },
    RedisService
  ],
  exports: [EVENT_BUS],
})
export class EventBusModule {}
