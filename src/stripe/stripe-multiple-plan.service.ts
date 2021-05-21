import {
  InjectStripeClient,
  StripeWebhookHandler,
} from '@golevelup/nestjs-stripe';
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeMultiplePlanService {
  constructor(@InjectStripeClient() private stripeClient: Stripe) {}

  /* ****************************************
   * STRIPE WebHooks
   * ****************************************/

  @StripeWebhookHandler('customer.updated')
  handleCustomerUpdated(evt: Stripe.Event) {
    console.log('StripeMultiplePlanService customer.updated: ', evt);
    const dataObject = evt.data.object as Stripe.Customer;
    return true;
  }

  @StripeWebhookHandler('invoice.upcoming')
  handleInvoiceUpcoming(evt: Stripe.Event) {
    console.log('StripeMultiplePlanService invoice.upcoming: ', evt);
    const dataObject = evt.data.object as Stripe.Invoice;
    return true;
  }

  @StripeWebhookHandler('invoice.created')
  handleInvoiceCreated(evt: Stripe.Event) {
    console.log('StripeMultiplePlanService invoice.created: ', evt);
    const dataObject = evt.data.object as Stripe.Invoice;
    return true;
  }

  @StripeWebhookHandler('customer.subscription.created')
  handleCustomerSubsCreated(evt: Stripe.Event) {
    console.log(
      'StripeMultiplePlanService customer.subscription.created: ',
      evt,
    );
    const dataObject = evt.data.object as Stripe.Subscription;
    return true;
  }

  @StripeWebhookHandler('customer.created')
  handleCustomerCreated(evt: Stripe.Event) {
    console.log('StripeMultiplePlanService customer.created: ', evt);
    const dataObject = evt.data.object as Stripe.Customer;

    return true;
  }

  @StripeWebhookHandler('invoice.finalized')
  handleInvoiceFinalized(evt: Stripe.Event) {
    console.log('StripeMultiplePlanService invoice.finalized: ', evt);
    const dataObject = evt.data.object as Stripe.Invoice;
    // If you want to manually send out invoices to your customers
    // or store them locally to reference to avoid hitting Stripe rate limits.
    return true;
  }

  @StripeWebhookHandler('invoice.payment_succeeded')
  async handleInvoicePaymentSucceeded(evt: Stripe.Event) {
    console.log('StripeMultiplePlanService invoice.payment_succeeded: ', evt);
    const dataObject = evt.data.object as Stripe.Invoice;

    // If you want to manually send out invoices to your customers
    // or store them locally to reference to avoid hitting Stripe rate limits.
    return true;
  }

  @StripeWebhookHandler('invoice.payment_failed')
  handleInvoicePaymentFailed(evt: Stripe.Event) {
    console.log('StripeMultiplePlanService invoice.payment_failed: ', evt);
    const dataObject = evt.data.object as Stripe.Invoice;
    // If the payment fails or the customer does not have a valid payment method,
    //  an invoice.payment_failed event is sent, the subscription becomes past_due.
    // Use this webhook to notify your user that their payment has
    // failed and to retrieve new card details.
    return true;
  }
}
