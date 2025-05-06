import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, repl } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { AppModule } from './app/app.module';

async function bootstrap() {
  if (process.env.START_MODE === 'REPL') {
    Logger.log('🚀 Starting application in REPL mode...');
    await repl(AppModule);
  } else {
    Logger.log('🚀 Starting application in Server mode...');
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: 'http://localhost:4200',
      credentials: true,
    });
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ 
      transform: true,
      whitelist: true,
    }));

    const port = process.env.PORT || 3000;
    await app.listen(port);
    Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
  }
}

bootstrap();
