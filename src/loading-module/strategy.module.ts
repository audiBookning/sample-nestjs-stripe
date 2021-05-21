import { DynamicModule, Module } from '@nestjs/common';
import { config } from 'dotenv';
import { StripeCheckoutModule } from '../stripe-checkout/stripe-checkout.module';
import { StripeFixedPriceModule } from '../stripe-fixed-price/stripe-fixed-price.module';
import { StripeMeteredUsageModule } from '../stripe-metered-usage/stripe-metered-usage.module';
import { StripeMultiPlanModule } from '../stripe-multi-plan/stripe-multiple-plan.module';
import { StripePerSeatModule } from '../stripe-per-seat/stripe-per-seat.module';
config();

enum StrategyEnum {
  Checkout = 'Checkout',
  Fixed = 'Fixed',
  Metered = 'Metered',
  Multi = 'Multi',
  Seat = 'Seat',
}

@Module({})
export class StrategyModule {
  public static forRoot(): DynamicModule {
    const strategy = process.env.STRIPE_STRATEGY;
    const modulesImports = {
      Checkout: StripeCheckoutModule,
      Fixed: StripeFixedPriceModule,
      Metered: StripeMeteredUsageModule,
      Multi: StripeMultiPlanModule,
      Seat: StripePerSeatModule,
    };

    if (!modulesImports[strategy]) {
      throw new Error('Wrong module string');
    }
    return {
      module: StrategyModule,
      imports: [modulesImports[strategy]],
      providers: [],
      exports: [],
    };
  }
}
