import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UpdateUserHandler } from './cqrs/commands/handlers/update-user.handler';
import { GetUserHandler } from './cqrs/queries/handler/get-user.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './cqrs/commands/handlers/create-user.handler';
import { DeleteUserHandler } from './cqrs/commands/handlers/delete-user.handler';
import { CheckLoginBotHandler } from './cqrs/queries/handler/check-login-bot.handler';
import { CheckLoginHandler } from './cqrs/queries/handler/check-login.handler';
import { SearchUsersHandler } from './cqrs/queries/handler/search-users.handler';
import { EventBusModule, PrismaService, ResponseFormatterService, SnowflakeService } from 'src/lib';
import { AtlasRedisService } from 'src/services/redis.service';

@Module({
  imports: [
    CqrsModule, 
    EventBusModule.register(AtlasRedisService),
  ],
  controllers: [UsersController],
  providers: [
    PrismaService,
    // AtlasRedisService,
    // SnowflakeService,
    // ResponseFormatterService,
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
