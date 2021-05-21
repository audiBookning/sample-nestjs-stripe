import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CancelSubscriptionDto } from './dto/cancel-subscription.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { FPCreateSubscriptionDto } from './dto/create-subscription.dto';
import { FPGetInvoicePreviewDto } from './dto/get-invoice-preview.dto';
import { FPUpdateSubscriptionDto } from './dto/update-subscription.dto';

// REF: https://github.com/stripe-samples/subscription-use-cases/blob/master/fixed-price-subscriptions/server/node/server.js

@Controller('stripe-fixed-price')
export class StripeFixedPriceController {
  constructor(
    private readonly configSvc: ConfigService,
    @InjectStripeClient() private stripeClient: Stripe,
  ) {}

  // TODO: Implement with Config
  @Get('setup')
  async getSetup() {
    const prices = await this.stripeClient.prices.list({
      lookup_keys: ['sample_basic', 'sample_premium'],
      expand: ['data.product'],
    });
    return {
      publishableKey: this.configSvc.get<string>('stripe.publishablekey'),
      proPrice: prices.data,
    };
  }

  @Post('create-customer')
  async createCustomer(@Body() { email }: CreateCustomerDto) {
    try {
      // Create a new customer object
      const customer = await this.stripeClient.customers.create({
        email,
      });

      // Save the customer.id in your database alongside your user.
      // We're simulating authentication with a cookie.
      // res.cookie('customer', customer.id, { maxAge: 900000, httpOnly: true });

      return {
        customer,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // TODO: implement retriving of customerID from DB or Auth
  @Post('create-subscription')
  async createSubscription(@Body() { priceId }: FPCreateSubscriptionDto) {
    // Simulate authenticated user. In practice this will be the
    // Stripe Customer ID related to the authenticated user.
    // const customerId = req.cookies['customer'];
    const customerId = '';

    // Create the subscription
    try {
      const subscription = await this.stripeClient.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: priceId,
          },
        ],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      // Type checking the type unions
      const latest_invoice = subscription.latest_invoice;
      if (typeof latest_invoice === 'string') {
        throw new Error('latest_invoice not expanded');
      }
      const payment_intent = latest_invoice.payment_intent;
      if (typeof payment_intent === 'string') {
        throw new Error('payment_intent not expanded');
      }

      return {
        subscriptionId: subscription.id,
        clientSecret: payment_intent.client_secret,
      };
    } catch (error) {
      console.log('createSubscription: ', error);
      throw error;
    }
  }

  // TODO: Implement with Config
  // TODO: implement retriving of customerID from DB or Auth
  @Get('invoice-preview')
  async getInvoicePreview(
    @Query() { subscriptionId, newPriceLookupKey }: FPGetInvoicePreviewDto,
  ) {
    const customerId = 'customer';
    const priceId = this.configSvc.get<string>(
      `stripeFixedPrice.${newPriceLookupKey}`,
    );

    const subscription = await this.stripeClient.subscriptions.retrieve(
      subscriptionId,
    );

    const invoice = await this.stripeClient.invoices.retrieveUpcoming({
      customer: customerId,
      subscription: subscriptionId,
      subscription_items: [
        {
          id: subscription.items.data[0].id,
          price: priceId,
        },
      ],
    });

    return { invoice };
  }

  @Post('cancel-subscription')
  async cancelSubscription(@Body() { subscriptionId }: CancelSubscriptionDto) {
    // Cancel the subscription
    try {
      const deletedSubscription = await this.stripeClient.subscriptions.del(
        subscriptionId,
      );

      return { subscription: deletedSubscription };
    } catch (error) {
      throw error;
    }
  }

  // TODO: Implement with Config
  @Post('update-subscription')
  async updateSubscription(
    @Body() { subscriptionId, newPriceLookupKey }: FPUpdateSubscriptionDto,
  ) {
    try {
      const subscription = await this.stripeClient.subscriptions.retrieve(
        subscriptionId,
      );
      const updatedSubscription = await this.stripeClient.subscriptions.update(
        subscriptionId,
        {
          items: [
            {
              id: subscription.items.data[0].id,
              price: this.configSvc.get<string>(
                `stripeFixedPrice.${newPriceLookupKey}`,
              ),
            },
          ],
        },
      );

      return { subscription: updatedSubscription };
    } catch (error) {
      throw error;
    }
  }

  // TODO: implement retriving of customerID from DB or Auth
  @Get('subscriptions')
  async getSubscriptions() {
    // Simulate authenticated user. In practice this will be the
    // Stripe Customer ID related to the authenticated user.
    const customerId = 'customer';

    const subscriptions = await this.stripeClient.subscriptions.list({
      customer: customerId,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    return { subscriptions };
  }
}
