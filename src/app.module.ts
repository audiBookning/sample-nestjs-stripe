import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import baseConfig from './config/base.config';
import checkoutConfig from './config/checkout.config';
import fixedPriceConfig from './config/fixed-price.config';
import meteredUsageConfig from './config/metered-usage.config';
import multiPlanConfig from './config/multi-plan.config';
import perSeatConfig from './config/per-seat.config';
import { StripeCheckoutModule } from './stripe-checkout/stripe-checkout.module';
// import { StripeFixedPriceModule } from './stripe-fixed-price/stripe-fixed-price.module';
// import { StripeMeteredUsageModule } from './stripe-metered-usage/stripe-metered-usage.module';
// import { StripeMultiPlanModule } from './stripe-multi-plan/stripe-multiple-plan.module';
// import { StripePerSeatModule } from './stripe-per-seat/stripe-per-seat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        baseConfig,
        checkoutConfig,
        fixedPriceConfig,
        meteredUsageConfig,
        multiPlanConfig,
        perSeatConfig,
      ],
      isGlobal: true,
    }),
    StripeCheckoutModule,
    // StripeFixedPriceModule,
    // StripeMeteredUsageModule,
    // StripeMultiPlanModule,
    // StripePerSeatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
