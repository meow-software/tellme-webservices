import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserProxyService } from './services/user-proxy.service';
import { EventBusModule, JwtAuthGuard, JwtStrategy } from 'src/lib';
import { RedisService } from 'src/lib/redis/redis.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    EventBusModule.register(RedisService),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, UserProxyService, RedisService
    
  ],
  exports: [JwtAuthGuard],
})
export class AuthModule { }
