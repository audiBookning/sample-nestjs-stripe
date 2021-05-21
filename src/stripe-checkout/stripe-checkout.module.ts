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
import { StripeCheckoutController } from './stripe-checkout.controller';
import { StripeCheckoutService } from './stripe-checkout.service';
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
  controllers: [StripeCheckoutController],
  providers: [StripeCheckoutService],
})
export class StripeCheckoutModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    applyRawBodyOnlyTo(consumer, {
      method: RequestMethod.ALL,
      path: 'stripe/webhook',
    });
  }
}
