import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ProxyController } from './controllers/proxy.controller';
import { DynamicRateLimitGuard } from './guards/dynamic-rate-limit.guard';
import { RedisService } from 'src/lib';
import { AuthModule } from './auth/auth.module';
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
    AuthModule,
  ],
  controllers: [AppController, ProxyController],
  providers: [
    AppService, 
    DynamicRateLimitGuard,
    RedisService,
  ],
})
export class AppModule {}
