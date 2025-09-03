import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path'; 
import { UsersModule } from './users/users.module';
import { AuthModule, PrismaService, ResponseFormatterInterceptor, ResponseFormatterService, SnowflakeService } from './lib';
import { AtlasRedisService } from './services/redis.service';

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
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    AtlasRedisService,
    SnowflakeService,
    ResponseFormatterService,
    ResponseFormatterInterceptor
  ],
  exports: [
    PrismaService,
    AtlasRedisService,
    SnowflakeService,
    ResponseFormatterService
  ]
})
export class AppModule { }
