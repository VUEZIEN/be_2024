import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; //import
import { useContainer } from 'class-validator';
import { MicroserviceOptions } from '@nestjs/microservices';
import { kafkaConfig } from './config/kafka.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      transform: true,
      validateCustomDecorators: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.connectMicroservice<MicroserviceOptions>(kafkaConfig);
  app.startAllMicroservices();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(3200);
}
bootstrap();
