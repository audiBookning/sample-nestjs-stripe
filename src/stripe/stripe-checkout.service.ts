import {
  InjectStripeClient,
  StripeWebhookHandler,
} from '@golevelup/nestjs-stripe';
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeCheckoutService {
  constructor(@InjectStripeClient() private stripeClient: Stripe) {}

  /* ****************************************
   * STRIPE WebHooks
   * ****************************************/

  @StripeWebhookHandler('checkout.session.completed')
  handleCheckoutSessionCompleted(evt: Stripe.Event) {
    console.log('StripeCheckoutService checkout.session.completed: ', evt);
    const dataObject = evt.data.object as Stripe.Checkout.Session;
    console.log(`🔔  Payment received!`);
    return true;
  }
}
