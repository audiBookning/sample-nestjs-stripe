import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import { Controller, Get, Param } from '@nestjs/common';
import { Stripe } from 'stripe';
import { StripeAppService } from './stripe.service';
// REF: https://github.com/stripe-samples/checkout-single-subscription/blob/master/server/node/server.js

@Controller('stripe')
export class StripeAppController {
  constructor(
    private readonly stripeSvc: StripeAppService,
    @InjectStripeClient() private stripeClient: Stripe,
  ) {}

  @Get('hello')
  getHello(): string {
    return this.stripeSvc.getHello();
  }

  // TODO: Implement with Config
  // TODO: Change to @Post and Body payload
  @Get('create-checkout-session/:priceId')
  async createCheckoutSession(@Param('priceId') priceId: string) {
    const domainURL = process.env.DOMAIN;
    // Create new Checkout Session for the order
    // Other optional params include:
    // [billing_address_collection] - to display billing address details on the page
    // [customer] - if you have an existing Stripe Customer ID
    // [customer_email] - lets you prefill the email input in the form
    // For full details see https://stripe.com/docs/api/checkout/sessions/create
    try {
      const session = await this.stripeClient.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
        success_url: `${domainURL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${domainURL}/canceled.html`,
      });

      return {
        sessionId: session.id,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // TODO: Implement with Config
  // TODO: Change to @Post and Body payload
  @Get('customer-portal/:sessionId')
  async getCustomerPortal(@Param('sessionId') sessionId: string) {
    const checkoutsession = await this.stripeClient.checkout.sessions.retrieve(
      sessionId,
    );
    // This is the url to which the customer will be redirected when they are done
    // managing their billing with the portal.
    const returnUrl = process.env.PORTAL_RETURN_URL;
    const portalsession = await this.stripeClient.billingPortal.sessions.create(
      {
        customer: checkoutsession.customer as string,
        return_url: returnUrl,
      },
    );

    return {
      url: portalsession.url,
    };
  }

  // TODO: Implement with Config
  @Get('setup')
  getSetup() {
    return {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      // TODO: These should come from the Databse or from the stripe API
      basicPrice: process.env.BASIC_PRICE_ID,
      proPrice: process.env.PRO_PRICE_ID,
    };
  }

  // Fetch the Checkout Session to display the JSON result on the success page
  @Get('checkout-session/:sessionId')
  checkoutSession(
    @Param('sessionId') sessionId: string,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    return this.stripeClient.checkout.sessions.retrieve(sessionId);
  }
}
