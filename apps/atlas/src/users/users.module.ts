import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/services/prisma.service';
import { RedisService } from 'src/services/redis.service';
import { UpdateUserHandler } from './cqrs/commands/handlers/update-user.handler';
import { GetUserHandler } from './cqrs/queries/handler/get-user.handler';
import { SnowflakeService } from 'src/services/snowflake.service';
import { EventBusModule } from 'src/event-bus/event-bus.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './cqrs/commands/handlers/create-user.handler';
import { DeleteUserHandler } from './cqrs/commands/handlers/delete-user.handler';
import { CheckLoginBotHandler } from './cqrs/queries/handler/check-login-bot.handler';
import { CheckLoginHandler } from './cqrs/queries/handler/check-login.handler';
import { SearchUsersHandler } from './cqrs/queries/handler/search-users.handler';
import { ResponseFormatterService } from 'src/services/response-formatter.service';

@Module({
  imports: [
    CqrsModule, 
    EventBusModule
  ],
  controllers: [UsersController],
  providers: [
    PrismaService,
    RedisService,
    SnowflakeService,
    ResponseFormatterService,
    // CQRS
    // Commands
    CreateUserHandler,
    DeleteUserHandler,
    UpdateUserHandler,
    // Queries
    CheckLoginBotHandler,
    CheckLoginHandler,
    GetUserHandler,
    SearchUsersHandler
  ]
})
export class UsersModule {}
