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
import { config } from 'dotenv';
import { StripeCheckoutController } from './stripe-checkout.controller';
import { StripeFixedPriceController } from './stripe-fixed-price.controller';
import { StripeMeteredUsageController } from './stripe-metered-usage.controller';
import { StripeAppService } from './stripe.service';
config();

@Module({
  imports: [
    JsonBodyMiddleware,
    RawBodyMiddleware,
    StripeModule.forRoot(StripeModule, {
      apiKey: process.env.STRIPE_API_KEY,
      webhookConfig: {
        stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      },
    }),
  ],
  controllers: [
    StripeCheckoutController,
    StripeFixedPriceController,
    StripeMeteredUsageController,
  ],
  providers: [StripeAppService],
})
export class StripeAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    applyRawBodyOnlyTo(consumer, {
      method: RequestMethod.ALL,
      path: 'stripe/webhook',
    });
  }
}
