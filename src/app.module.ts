import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { StripeAppModule } from './stripe/stripe.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    StripeAppModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
