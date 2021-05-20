import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  const configService = app.get(ConfigService);

  const port = configService.get<string>('port');

  await app.listen(port);
  console.log(`App started at http://localhost:${port}/`);
}
bootstrap();
