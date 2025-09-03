import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

/* needs
npm install @nestjs/passport passport passport-jwt
npm install -D @types/passport-jwt
*/

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy],
  exports: [PassportModule, JwtStrategy],})
export class AuthModule {}
