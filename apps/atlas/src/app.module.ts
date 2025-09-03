import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './services/prisma.service';
import { RedisService } from './services/redis.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SnowflakeService } from './services/snowflake.service';
import { RedisEventBus } from './event-bus/redis-event-bus';
import { EventBusModule } from './event-bus/event-bus.module';
import { ResponseFormatterService } from './services/response-formatter.service';
import { ResponseFormatterInterceptor } from './interceptor/response-formatter.interceptor';
import * as path from 'path'; 

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        path.resolve(__dirname, '../../../.env'), // turbo .env
        path.resolve(__dirname, './.env'), // local .env
      ]
    }),  
    UsersModule,
    AuthModule,
    EventBusModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    RedisService,
    SnowflakeService,
    ResponseFormatterService,
    ResponseFormatterInterceptor
  ],
  exports: [
    PrismaService,
    RedisService,
    SnowflakeService,
    ResponseFormatterService
  ]
})
export class AppModule { }
