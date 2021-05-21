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
