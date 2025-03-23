import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express'; // Import NestExpressApplication
import { join } from 'path'; // Import the `join` function from path

async function bootstrap() {
  // Use NestExpressApplication to enable static file serving
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // ✅ Enable CORS for frontend access
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // ✅ Serve static files from the "uploads" directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // URL prefix for accessing static files
  });

  // ✅ Log environment variables
  Logger.log('Environment Variables:', 'Bootstrap');
  Logger.log(`DATABASE_HOST: ${configService.get<string>('DATABASE_HOST')}`, 'Bootstrap');
  Logger.log(`DATABASE_PORT: ${configService.get<number>('DATABASE_PORT')}`, 'Bootstrap');
  Logger.log(`DATABASE_USER: ${configService.get<string>('DATABASE_USER')}`, 'Bootstrap');
  Logger.log(`DATABASE_PASSWORD: ${configService.get<string>('DATABASE_PASSWORD')}`, 'Bootstrap');
  Logger.log(`DATABASE_NAME: ${configService.get<string>('DATABASE_NAME')}`, 'Bootstrap');

  // ✅ Log available routes using NestJS built-in method
  await app.listen(configService.get<number>('PORT') || 5000);
  Logger.log(`Application is running on: ${await app.getUrl()}`, 'Bootstrap');
}

bootstrap();