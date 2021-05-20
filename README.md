# Just a little test to try to implement stripe with Nestjs

## Libs used

- "[@golevelup/nestjs-stripe](https://github.com/golevelup/nestjs/tree/master/packages/stripe)": "^0.2.0",

- "[@golevelup/nestjs-webhooks](https://github.com/golevelup/nestjs/tree/master/packages/webhooks)": "^0.2.7",

## Notes

- The whole stripe code is in the stripe.module

- There are 2 different controllers and routes, implementing different strategies

  - The code used in the `StripeCheckoutController` is directly based from [Using Checkout for subscriptions](https://github.com/stripe-samples/checkout-single-subscription/)

  - The code used in the `StripeFixedPriceController` is directly based from [Subscriptions with fixed price](https://github.com/stripe-samples/subscription-use-cases/tree/master/fixed-price-subscriptions/)

- The webhooks are consumed in the stripe service with the help of the @StripeWebhookHandler decorator.
