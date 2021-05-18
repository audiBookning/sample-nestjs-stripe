import { StripeWebhookHandler } from '@golevelup/nestjs-stripe';
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeAppService {
  getHello(): string {
    return 'Hello World from Stripe!';
  }

  // ****************************************
  // STRIPE WebHooks
  // ****************************************

  @StripeWebhookHandler('payment_intent.created')
  handlePaymentIntentCreated(evt: Stripe.PaymentIntentCreateParams) {
    console.log('handlePaymentIntentCreated evt: ', evt);
    return true;
  }

  @StripeWebhookHandler('customer.created')
  handleCustomerCreated(evt: Stripe.CustomerCreateParams) {
    console.log('handleCustomerCreated evt: ', evt);
    return true;
  }
}
