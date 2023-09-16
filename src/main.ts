import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // allow static html files to be rendered
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('html');

  const config = new DocumentBuilder()
    .setTitle('Morning Hour')
    .setDescription('The API of the Morning Hour website')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // allow the front end to sign in and reach the data
  app.enableCors({
    origin: process.env.FRONTEND_URLS.split(','),
    credentials: true,
  });

  await app.listen(process.env.PORT, '0.0.0.0');
}
bootstrap();
