import {
  InjectStripeClient,
  StripeWebhookHandler,
} from '@golevelup/nestjs-stripe';
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeAppService {
  constructor(@InjectStripeClient() private stripeClient: Stripe) {}

  getHello(): string {
    return 'Hello World from Stripe!';
  }

  /* ****************************************
   * STRIPE WebHooks
   * ****************************************/

  // ****************************************
  // CHECKOUT
  // ****************************************

  @StripeWebhookHandler('checkout.session.completed')
  handleCheckoutSessionCompleted(evt: Stripe.Event) {
    console.log('handleCheckoutSessionCompleted evt: ', evt);
    const dataObject = evt.data.object as Stripe.Checkout.Session;
    console.log(`🔔  Payment received!`);
    return true;
  }

  // *******************************
  // METERED USAGE SUBSCRIPTION
  // *******************************

  // INFO: WEBHOOKS  already implemented in strategies
  // invoice.payment_failed, invoice.finalized,
  // customer.subscription.deleted, customer.subscription.trial_will_end

  @StripeWebhookHandler('invoice.paid')
  handleInvoicePaid(evt: Stripe.Event) {
    console.log('handleCheckoutSessionCompleted evt: ', evt);
    const dataObject = evt.data.object as Stripe.Invoice;
    console.log(`🔔  Invoice paid!`);
    // Used to provision services after the trial has ended.
    // The status of the invoice will show up as paid. Store the status in your
    // database to reference when a user accesses your service to avoid hitting rate limits.
    return true;
  }

  // *******************************
  // FIXED PRICE SUBSCRIPTION
  // *******************************
  @StripeWebhookHandler('invoice.payment_succeeded')
  async handleInvoicePaymentSucceeded(evt: Stripe.Event) {
    console.log('handleInvoicePaymentSucceeded evt: ', evt);
    const dataObject = evt.data.object as Stripe.Invoice;

    const payment_intent_id = dataObject['payment_intent'];
    if (typeof payment_intent_id !== 'string') {
      throw new Error('payment_intent_id should be of type string');
    }
    const payment_intent = await this.stripeClient.paymentIntents.retrieve(
      payment_intent_id,
    );
    console.log(`billing_reason: `, dataObject['billing_reason']);
    console.log(`payment_intent: `, payment_intent);

    try {
      if (dataObject['billing_reason'] == 'subscription_create') {
        // The subscription automatically activates after successful payment
        // Set the payment method used to pay the first invoice
        // as the default payment method for that subscription
        const subscription_id = dataObject['subscription'];
        const payment_intent_id = dataObject['payment_intent'];

        if (typeof subscription_id !== 'string') {
          throw new Error('subscription_id should be of type string');
        }

        if (typeof payment_intent_id !== 'string') {
          throw new Error('payment_intent_id should be of type string');
        }

        // Retrieve the payment intent used to pay the subscription
        const payment_intent = await this.stripeClient.paymentIntents.retrieve(
          payment_intent_id,
        );

        if (typeof payment_intent.payment_method !== 'string') {
          throw new Error('payment_method should be of type string');
        }

        const subscription = await this.stripeClient.subscriptions.update(
          subscription_id,
          {
            default_payment_method: payment_intent.payment_method,
          },
        );

        console.log(
          'Default payment method set for subscription:' +
            payment_intent.payment_method,
        );
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @StripeWebhookHandler('invoice.payment_failed')
  handleInvoicePaymentFailed(evt: Stripe.Event) {
    console.log('handleInvoicePaymentFailed evt: ', evt);
    const dataObject = evt.data.object as Stripe.Invoice;
    // If the payment fails or the customer does not have a valid payment method,
    //  an invoice.payment_failed event is sent, the subscription becomes past_due.
    // Use this webhook to notify your user that their payment has
    // failed and to retrieve new card details.
    return true;
  }

  @StripeWebhookHandler('invoice.finalized')
  handleInvoiceFinalized(evt: Stripe.Event) {
    console.log('handleInvoiceFinalized evt: ', evt);
    const dataObject = evt.data.object as Stripe.Invoice;
    // If you want to manually send out invoices to your customers
    // or store them locally to reference to avoid hitting Stripe rate limits.
    return true;
  }

  @StripeWebhookHandler('customer.subscription.deleted')
  handleCustomerSubsDeleted(evt: Stripe.Event) {
    console.log('handleCustomerSubsDeleted evt: ', evt);
    const dataObject = evt.data.object as Stripe.Subscription;
    if (evt.request != null) {
      // handle a subscription cancelled by your request
      // from above.
    } else {
      // handle subscription cancelled automatically based
      // upon your subscription settings.
    }
    return true;
  }

  @StripeWebhookHandler('customer.subscription.trial_will_end')
  handleCustomerSubsTrialEnd(evt: Stripe.Event) {
    console.log('handleCustomerSubsTrialEnd evt: ', evt);
    const dataObject = evt.data.object as Stripe.Subscription;
    // Send notification to your user that the trial will end
    return true;
  }

  // *******************************
  // PER SEAT SUBSCRIPTION
  // *******************************

  // INFO: WEBHOOKS already implemented in strategies
  // invoice.paid, invoice.payment_failed, invoice.finalized,
  // customer.subscription.deleted, customer.subscription.trial_will_end

  // *******************************
  // MULTIPLE PLAN SUBSCRIPTION
  // *******************************

  // INFO: WEBHOOKS already implemented in other strategies
  // customer.created, invoice.finalized, invoice.payment_succeeded
  // invoice.payment_failed,

  @StripeWebhookHandler('customer.updated')
  handleCustomerUpdated(evt: Stripe.Event) {
    console.log('handlePaymentIntentCreated evt: ', evt);
    const dataObject = evt.data.object as Stripe.Customer;
    return true;
  }

  @StripeWebhookHandler('invoice.upcoming')
  handleInvoiceUpcoming(evt: Stripe.Event) {
    console.log('handlePaymentIntentCreated evt: ', evt);
    const dataObject = evt.data.object as Stripe.Invoice;
    return true;
  }

  @StripeWebhookHandler('invoice.created')
  handleInvoiceCreated(evt: Stripe.Event) {
    console.log('handlePaymentIntentCreated evt: ', evt);
    const dataObject = evt.data.object as Stripe.Invoice;
    return true;
  }

  @StripeWebhookHandler('customer.subscription.created')
  handleCustomerSubsCreated(evt: Stripe.Event) {
    console.log('handlePaymentIntentCreated evt: ', evt);
    const dataObject = evt.data.object as Stripe.Subscription;
    return true;
  }

  // ****************************************
  // Various test
  // ****************************************

  @StripeWebhookHandler('payment_intent.created')
  handlePaymentIntentCreated(evt: Stripe.Event) {
    console.log('handlePaymentIntentCreated evt: ', evt);
    const dataObject = evt.data.object as Stripe.PaymentIntent;
    return true;
  }

  @StripeWebhookHandler('customer.created')
  handleCustomerCreated(evt: Stripe.Event) {
    console.log('handleCustomerCreated evt: ', evt);
    const dataObject = evt.data.object as Stripe.Customer;

    return true;
  }
}
