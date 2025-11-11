import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors(); // Add CORS if needed

  await app.init();

  if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    await app.listen(PORT);
    console.log(`Server running locally on http://localhost:${PORT}`);
  }
}

bootstrap();

export default server;
