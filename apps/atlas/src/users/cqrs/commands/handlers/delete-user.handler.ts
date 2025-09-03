
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../delete-user.command';
import { Inject } from '@nestjs/common';
import type { IEventBus } from 'src/lib';
import {SnowflakeService, PrismaService, EVENT_BUS} from 'src/lib';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private prisma: PrismaService, 
    private snowflake: SnowflakeService, 
    @Inject(EVENT_BUS) private eventBus: IEventBus) {}

  async execute(command: DeleteUserCommand) {
    const user = await this.prisma.user.delete({ where: { id: this.snowflake.toBigInt(command.id) } });

    await this.eventBus.publish('user.deleted', { id: user.id });

    return user;
  }
}
