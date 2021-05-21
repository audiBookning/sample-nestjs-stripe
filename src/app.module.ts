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
import { StrategyModule } from './loading-module/strategy.module';

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
    StrategyModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
