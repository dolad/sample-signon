import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/exception.filter';

import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';


async function bootstrap() {
  const server = express();
  server.use(express.static('public')); // Serve static files from 'public' directory

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.useGlobalFilters(new AllExceptionsFilter());


  const port = process.env.PORT ?? 3000
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
