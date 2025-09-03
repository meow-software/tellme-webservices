
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/services/prisma.service';
import * as eventBusInterface from 'src/lib';
import { DeleteUserCommand } from '../delete-user.command';
import { SnowflakeService } from 'src/services/snowflake.service';
import { Inject } from '@nestjs/common';
import { EVENT_BUS } from 'src/event-bus/event-bus.module';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private prisma: PrismaService, 
    private snowflake: SnowflakeService, 
    @Inject(EVENT_BUS) private eventBus: eventBusInterface.IEventBus) {}

  async execute(command: DeleteUserCommand) {
    const user = await this.prisma.user.delete({ where: { id: this.snowflake.toBigInt(command.id) } });

    await this.eventBus.publish('user.deleted', { id: user.id });

    return user;
  }
}
