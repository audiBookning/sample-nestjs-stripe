import {
  InjectStripeClient,
  StripeWebhookHandler,
} from '@golevelup/nestjs-stripe';
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeMeteredUsageService {
  constructor(@InjectStripeClient() private stripeClient: Stripe) {}

  /* ****************************************
   * STRIPE WebHooks
   * ****************************************/

  @StripeWebhookHandler('invoice.paid')
  handleInvoicePaid(evt: Stripe.Event) {
    console.log('StripeMeteredUsageService invoice.paid: ', evt);
    const dataObject = evt.data.object as Stripe.Invoice;
    console.log(`🔔  Invoice paid!`);
    // Used to provision services after the trial has ended.
    // The status of the invoice will show up as paid. Store the status in your
    // database to reference when a user accesses your service to avoid hitting rate limits.
    return true;
  }

  @StripeWebhookHandler('invoice.payment_failed')
  handleInvoicePaymentFailed(evt: Stripe.Event) {
    console.log('StripeMeteredUsageService invoice.payment_failed: ', evt);
    const dataObject = evt.data.object as Stripe.Invoice;
    // If the payment fails or the customer does not have a valid payment method,
    //  an invoice.payment_failed event is sent, the subscription becomes past_due.
    // Use this webhook to notify your user that their payment has
    // failed and to retrieve new card details.
    return true;
  }

  @StripeWebhookHandler('invoice.finalized')
  handleInvoiceFinalized(evt: Stripe.Event) {
    console.log('StripeMeteredUsageService invoice.finalized: ', evt);
    const dataObject = evt.data.object as Stripe.Invoice;
    // If you want to manually send out invoices to your customers
    // or store them locally to reference to avoid hitting Stripe rate limits.
    return true;
  }

  @StripeWebhookHandler('customer.subscription.deleted')
  handleCustomerSubsDeleted(evt: Stripe.Event) {
    console.log(
      'StripeMeteredUsageService customer.subscription.deleted: ',
      evt,
    );
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
    console.log(
      'StripeMeteredUsageService customer.subscription.trial_will_end: ',
      evt,
    );
    const dataObject = evt.data.object as Stripe.Subscription;
    // Send notification to your user that the trial will end
    return true;
  }
}
