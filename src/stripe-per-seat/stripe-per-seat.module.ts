import { StripeModule } from '@golevelup/nestjs-stripe';
import {
  applyRawBodyOnlyTo,
  JsonBodyMiddleware,
  RawBodyMiddleware,
} from '@golevelup/nestjs-webhooks';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { StripePerSeatController } from './stripe-per-seat.controller';
import { StripePerSeatService } from './stripe-per-seat.service';
config();

@Module({
  imports: [
    JsonBodyMiddleware,
    RawBodyMiddleware,
    StripeModule.forRootAsync(StripeModule, {
      imports: [ConfigModule],
      useFactory: (configSvc: ConfigService) => ({
        apiKey: configSvc.get<string>('stripe.apiKey'),
        webhookConfig: {
          stripeWebhookSecret: configSvc.get<string>('stripe.webhookSecret'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [StripePerSeatController],
  providers: [StripePerSeatService],
})
export class StripePerSeatModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    applyRawBodyOnlyTo(consumer, {
      method: RequestMethod.ALL,
      path: 'stripe/webhook',
    });
  }
}
