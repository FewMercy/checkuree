import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/error/allException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();

  const port = process.env.PORT || 3000;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost), new ConsoleLogger()));

  app.enableCors();

  app.setGlobalPrefix('api/v1')

  const config = new DocumentBuilder()
    .setTitle('Attendance')
    .setDescription('Attendance API 서버 설명')
    .setVersion('v1.0')
    .addTag('Attendances')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Swagger에서 저장된 Bearer Token이 날아가지 않게 해줌(편의성)
    },
  });

  logger.verbose('====================================');
  logger.verbose(`==== SERVER IS RUNNING ON ${port} =====`);
  logger.verbose('====================================');
  await app.listen(port);
}
bootstrap();
