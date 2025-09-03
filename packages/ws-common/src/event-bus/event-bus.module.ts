
import { Module, Type, Provider, DynamicModule } from '@nestjs/common';
import { RedisEventBus } from './redis-event-bus';
import { AbstractRedis, EVENT_BUS } from '@tellme/ws-core';

export const REDIS_SERVICE  = Symbol('REDIS_SERVICE ');

/**
 * Factory function to create a dynamic EventBusModule
 * with a custom EventBusService implementation.
 */
@Module({})
export class EventBusModule {
  static register(service: Type<AbstractRedis>): DynamicModule {
    // Vérifier si la classe passée hérite bien de BaseEventBusService
    if (!(service.prototype instanceof AbstractRedis)) {
      throw new Error(
        `Invalid service provided to EventBusModule. ` +
        `Expected a subclass of AbstractRedis, got: ${service.name}`,
      );
    }

    const providers: Provider[] = [
      {
        provide: EVENT_BUS,
        useClass: RedisEventBus,
      },
      {
        provide: REDIS_SERVICE ,
        useClass: service
      }
    ];

    return {
      module: EventBusModule,
      providers,
      exports: [EVENT_BUS],
    };
  }
}