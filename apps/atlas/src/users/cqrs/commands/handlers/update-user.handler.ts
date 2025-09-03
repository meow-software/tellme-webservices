import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../update-user.command';
import { PrismaService } from 'src/services/prisma.service';
import { RedisService } from 'src/services/redis.service';
import { Inject } from '@nestjs/common';
import * as eventBusInterface from 'src/lib';
import { SnowflakeService } from 'src/services/snowflake.service';
import { EVENT_BUS } from 'src/event-bus/event-bus.module';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  private CACHE_TTL = 300;
  constructor(
    private prisma: PrismaService,
    private snowflake: SnowflakeService,
    private redis: RedisService,
    @Inject(EVENT_BUS) private eventBus: eventBusInterface.IEventBus,
  ) {}

  async execute(command: UpdateUserCommand) {
    const { userId, dto } = command;
    const user = await this.prisma.user.update({ where: { id: this.snowflake.toBigInt(userId) }, data: dto });
    // invalidate cache
    await this.redis.del(`user:${userId}`);
    // publish event
    await this.eventBus.publish('user.updated', {
      id: user.id,
      username: user.username,
      // avatar_url: user.avatar_url,
      fields: Object.keys(dto),
    });
    return user;
  }
}
