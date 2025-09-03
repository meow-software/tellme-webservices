import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path'; 

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        path.resolve(__dirname, '../../../.env'), // turbo .env
        path.resolve(__dirname, './.env'), // local .env
      ]
    }),  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
