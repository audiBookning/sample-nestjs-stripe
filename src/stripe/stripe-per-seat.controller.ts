import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PSCancelSubscriptionDto } from './per-seat-dto/cancel-subscription.dto';
import { PSCreateCustomerDto } from './per-seat-dto/create-customer.dto';
import { PSCreateSubscriptionDto } from './per-seat-dto/create-subscription.dto';
import { PSRetrieveSubsInfoDto } from './per-seat-dto/retrieve-subs-info.dto';
import { PSRetryInvoice } from './per-seat-dto/retry-invoice.dto';
import { PSRetryUpcomingInvoice } from './per-seat-dto/retry-upcoming-invoice.dto';
import { PSUpdateSubscriptionDto } from './per-seat-dto/update-subscription.dto';

// REF: https://github.com/stripe-samples/subscription-use-cases/blob/master/per-seat-subscriptions/server/node/server.js

@Controller('stripe-per-seat')
export class StripePerSeatController {
  constructor(
    private readonly configSvc: ConfigService,
    @InjectStripeClient() private stripeClient: Stripe,
  ) {}

  // TODO: Implement with Config
  @Get('setup')
  getSetup() {
    return {
      publishableKey: this.configSvc.get<string>('stripe.publishablekey}'),
    };
  }

  @Post('retrieve-subscription-information')
  async retrieveSubsInfo(@Body() { subscriptionId }: PSRetrieveSubsInfoDto) {
    const subscription = await this.stripeClient.subscriptions.retrieve(
      subscriptionId,
      {
        expand: [
          'latest_invoice',
          'customer.invoice_settings.default_payment_method',
          'items.data.price.product',
        ],
      },
    );

    const upcoming_invoice = await this.stripeClient.invoices.retrieveUpcoming({
      subscription: subscriptionId,
    });

    const item = subscription.items.data[0];

    // INFO: Type checking of the type unions. Because of the expand.
    if (typeof subscription.customer === 'string') {
      throw new Error('Customer not expanded');
    }
    if (!('invoice_settings' in subscription.customer)) {
      throw new Error('Customer not expanded');
    }

    if (
      typeof subscription.customer.invoice_settings.default_payment_method ===
      'string'
    ) {
      throw new Error('Default_payment_method not expanded');
    }

    if (typeof item.price.product === 'string') {
      throw new Error('Product not expanded');
    }
    if (!('name' in item.price.product)) {
      throw new Error('Product not expanded');
    }

    return {
      card: subscription.customer.invoice_settings.default_payment_method.card,
      product_description: item.price.product.name,
      current_price: item.price.id,
      current_quantity: item.quantity,
      latest_invoice: subscription.latest_invoice,
      upcoming_invoice: upcoming_invoice,
    };
  }

  @Post('create-customer')
  async createCustomer(@Body() { email }: PSCreateCustomerDto) {
    try {
      // Create a new customer object
      const customer = await this.stripeClient.customers.create({
        email,
      });

      // save the customer.id as stripeCustomerId
      // in your database.

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
  async createSubscription(
    @Body()
    { paymentMethodId, customerId, priceId, quantity }: PSCreateSubscriptionDto,
  ) {
    // Set the default payment method on the customer
    try {
      const payment_method = await this.stripeClient.paymentMethods.attach(
        paymentMethodId,
        {
          customer: customerId,
        },
      );

      await this.stripeClient.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: payment_method.id,
        },
      });

      // Create the subscription
      const subscription = await this.stripeClient.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: this.configSvc.get<string>(`stripePerSeat.${priceId}`),
            quantity: quantity,
          },
        ],
        expand: ['latest_invoice.payment_intent', 'plan.product'],
      });

      return subscription;
    } catch (error) {
      // return res.status(400).send({ error: { message: error.message } });
      throw error;
    }
  }

  @Post('retry-invoice')
  async retrySubscription(
    @Body() { customerId, paymentMethodId, invoiceId }: PSRetryInvoice,
  ) {
    // Set the default payment method on the customer

    try {
      const payment_method = await this.stripeClient.paymentMethods.attach(
        paymentMethodId,
        {
          customer: customerId,
        },
      );
      await this.stripeClient.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: payment_method.id,
        },
      });
    } catch (error) {
      // in case card_decline error
      throw error;
      /* return res
        .status(400)
        .send({ result: { error: { message: error.message } } }); */
    }

    const invoice = await this.stripeClient.invoices.retrieve(invoiceId, {
      expand: ['payment_intent'],
    });
    return invoice;
  }

  @Post('retrieve-upcoming-invoice')
  async retrieveIncomingInvoice(
    @Body()
    {
      subscriptionId,
      customerId,
      newPriceId,
      quantity,
    }: PSRetryUpcomingInvoice,
  ) {
    const new_price = this.configSvc.get<string>(`stripePerSeat.${newPriceId}`);

    const params = {};
    params['customer'] = customerId;
    let subscription;

    if (subscriptionId != null) {
      params['subscription'] = subscriptionId;
      subscription = await this.stripeClient.subscriptions.retrieve(
        subscriptionId,
      );

      const current_price = subscription.items.data[0].price.id;

      if (current_price == new_price) {
        params['subscription_items'] = [
          {
            id: subscription.items.data[0].id,
            quantity: quantity,
          },
        ];
      } else {
        params['subscription_items'] = [
          {
            id: subscription.items.data[0].id,
            deleted: true,
          },
          {
            price: new_price,
            quantity: quantity,
          },
        ];
      }
    } else {
      params['subscription_items'] = [
        {
          price: new_price,
          quantity: quantity,
        },
      ];
    }

    const invoice = await this.stripeClient.invoices.retrieveUpcoming(params);

    let response = {};

    if (subscriptionId != null) {
      const current_period_end = subscription.current_period_end;
      let immediate_total = 0;
      let next_invoice_sum = 0;

      invoice.lines.data.forEach((invoiceLineItem) => {
        if (invoiceLineItem.period.end == current_period_end) {
          immediate_total += invoiceLineItem.amount;
        } else {
          next_invoice_sum += invoiceLineItem.amount;
        }
      });

      response = {
        immediate_total: immediate_total,
        next_invoice_sum: next_invoice_sum,
        invoice: invoice,
      };
    } else {
      response = {
        invoice: invoice,
      };
    }

    return response;
  }

  @Post('cancel-subscription')
  async cancelSubscription(
    @Body() { subscriptionId }: PSCancelSubscriptionDto,
  ) {
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
    @Body() { subscriptionId, newPriceId, quantity }: PSUpdateSubscriptionDto,
  ) {
    const subscription = await this.stripeClient.subscriptions.retrieve(
      subscriptionId,
    );

    const current_price = subscription.items.data[0].price.id;
    const new_price = this.configSvc.get<string>(`stripePerSeat.${newPriceId}`);

    let updatedSubscription;

    if (current_price == new_price) {
      updatedSubscription = await this.stripeClient.subscriptions.update(
        subscriptionId,
        {
          items: [
            {
              id: subscription.items.data[0].id,
              quantity: quantity,
            },
          ],
        },
      );
    } else {
      updatedSubscription = await this.stripeClient.subscriptions.update(
        subscriptionId,
        {
          items: [
            {
              id: subscription.items.data[0].id,
              deleted: true,
            },
            {
              price: new_price,
              quantity: quantity,
            },
          ],
          expand: ['plan.product'],
        },
      );
    }

    // type checking the unions
    if (typeof subscription.customer !== 'string') {
      throw new Error('Customer should be of type string');
    }

    const invoice = await this.stripeClient.invoices.create({
      customer: subscription.customer,
      subscription: subscription.id,
      description:
        'Change to ' +
        quantity +
        ' seat(s) on the ' +
        updatedSubscription.plan.product.name +
        ' plan',
    });

    await this.stripeClient.invoices.pay(invoice.id);
    return { subscription: updatedSubscription };
  }
}
