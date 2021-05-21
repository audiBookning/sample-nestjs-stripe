import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { MPCreateCustomerDto } from './dto/create-customer.dto';
import { MPGetSubscriptionDto } from './dto/get-subscription.dto';

// REF: https://github.com/stripe-samples/charging-for-multiple-plan-subscriptions/blob/master/server/node/server.js

@Controller('stripe-multiple-plan')
export class StripeMultiplePlanController {
  constructor(
    private readonly configSvc: ConfigService,
    @InjectStripeClient() private stripeClient: Stripe,
  ) {}

  @Get('setup')
  async getSetup() {
    const animals = this.configSvc
      .get<string>('stripeMultiPlan.animals')
      .split(',');

    const lookup_keys = [];
    animals.forEach((animal) => lookup_keys.push(animal + '-monthly-usd'));

    const prices = await this.stripeClient.prices.list({
      lookup_keys: lookup_keys,
      expand: ['data.product'],
    });

    const products = [];
    prices.data.forEach((price) => {
      // INFO: Type checking
      if (typeof price.product === 'string') {
        throw new Error('Product not expanded');
      }
      if (!('metadata' in price.product)) {
        throw new Error('Product not expanded');
      }
      const product = {
        price: { id: price.id, unit_amount: price.unit_amount },
        title: price.product.metadata.title,
        emoji: price.product.metadata.emoji,
      };
      products.push(product);
    });

    return {
      publicKey: this.configSvc.get<string>('stripe.publishablekey'),
      minProductsForDiscount: this.configSvc.get<string>(
        'stripeMultiPlan.minProdDiscount',
      ),
      discountFactor: this.configSvc.get<string>(
        'stripeMultiPlan.discountFactor',
      ),
      products: products,
    };
  }

  @Post('create-customer')
  async createCustomer(
    @Body() { payment_method, email, priceIds }: MPCreateCustomerDto,
  ) {
    // This creates a new Customer and attaches
    // the PaymentMethod to be default for invoice in one API call.
    const customer = await this.stripeClient.customers.create({
      payment_method: payment_method,
      email: email,
      invoice_settings: {
        default_payment_method: payment_method,
      },
    });

    // In this example, we apply the coupon if the number of plans purchased
    // meets or exceeds the threshold.
    const minProdDiscount = Number(
      this.configSvc.get<string>('stripeMultiPlan.minProdDiscount'),
    );
    const eligibleForDiscount = priceIds.length >= minProdDiscount;
    const coupon = eligibleForDiscount
      ? this.configSvc.get<string>('stripeMultiPlan.couponId')
      : null;

    // At this point, associate the ID of the Customer object with your
    // own internal representation of a customer, if you have one.
    const subscription = await this.stripeClient.subscriptions.create({
      customer: customer.id,
      items: priceIds.map((priceId) => {
        return { price: priceId };
      }),
      expand: ['latest_invoice.payment_intent'],
      coupon: coupon,
    });

    subscription;
  }

  @Get('subscription')
  getSubscription(@Query() { subscriptionId }: MPGetSubscriptionDto) {
    return this.stripeClient.subscriptions.retrieve(subscriptionId);
  }
}
