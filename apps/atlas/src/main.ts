import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseFormatterInterceptor } from 'src/lib';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes properties not defined in the DTO
      forbidNonWhitelisted: true, // Rejects the request if non-whitelisted properties are present
      transform: true, // Transforms payloads into class instances
      transformOptions: {
        enableImplicitConversion: true, // Enables automatic type conversion
      },
    }),
  );
  app.useGlobalInterceptors(app.get(ResponseFormatterInterceptor));
  const port = process.env.ATLAS_PORT ?? 3002;
  await app.listen(port);
  console.log(`Atlas service listening on port ${port}.`);
}
bootstrap();
