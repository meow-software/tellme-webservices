
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../create-user.command';
import { ConflictException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { IEventBus } from 'src/lib';
import {SnowflakeService, PrismaService, EVENT_BUS} from 'src/lib';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private prisma: PrismaService,
    private snowflake: SnowflakeService,
    @Inject(EVENT_BUS) private eventBus: IEventBus
  ) { }

  async execute(command: CreateUserCommand) {
    // Hash password
    const hashedPassword = await bcrypt.hash(command.password, Number(process.env.PASSWORD_SALT_ROUNDS) ?? 10);
    // can be create
    let user;
    try {
      user = await this.prisma.user.create({
        data: {
          id: this.snowflake.generate(),
          username: command.username,
          email: command.email,
          password: hashedPassword,
        },
      });
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ConflictException('Username or email already exists.');
      }
    }

    await this.eventBus.publish('user.created', {
      id: this.snowflake.toString(user.id),
      username: user.username,
      email: user.email,
    });

    return user;
  }
}
