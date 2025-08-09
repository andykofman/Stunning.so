import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { AppModule } from './app.module';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);  // create the nestjs application
  app.setGlobalPrefix('api');
  app.enableCors({                  // Enable CORS for the frontend to access the backend
    origin: 'http://localhost:3000',
    credentials: true, // allow 3000 only for now
  });

  app.useGlobalPipes(   // Validate the request body
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  app.useGlobalFilters(new ValidationExceptionFilter());
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3001);
}
bootstrap();
