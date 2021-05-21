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
import { StripeMultiplePlanController } from './stripe-multiple-plan.controller';
import { StripeMultiplePlanService } from './stripe-multiple-plan.service';
config();

@Module({
  imports: [
    JsonBodyMiddleware,
    RawBodyMiddleware,
    /* StripeModule.forRoot(StripeModule, {
      apiKey: process.env.STRIPE_API_KEY,
      webhookConfig: {
        stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      },
    }), */
    StripeModule.forRootAsync(StripeModule, {
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        apiKey: process.env.STRIPE_API_KEY,
        webhookConfig: {
          stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [StripeMultiplePlanController],
  providers: [StripeMultiplePlanService],
})
export class StripeMultiPlanModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    applyRawBodyOnlyTo(consumer, {
      method: RequestMethod.ALL,
      path: 'stripe/webhook',
    });
  }
}
