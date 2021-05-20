# Just a little test to try to implement Stripe with Nestjs

Code Still not complete and not presentable 😎

## Libs used

- "[Nestjs](https://github.com/nestjs/nest)": "^7.6.15",

- "[Stripe Node.js Library](https://github.com/stripe/stripe-node)": "^8.148.0"

- "[@golevelup/nestjs-stripe](https://github.com/golevelup/nestjs/tree/master/packages/stripe)": "^0.2.0",

- "[@golevelup/nestjs-webhooks](https://github.com/golevelup/nestjs/tree/master/packages/webhooks)": "^0.2.7",

## Notes

- The whole stripe code is in the stripe.module

- There are 3 different controllers and routes, implementing different strategies

  - The code used in the `StripeCheckoutController` is directly based from [Using Checkout for subscriptions](https://github.com/stripe-samples/checkout-single-subscription/)

  - The code used in the `StripeFixedPriceController` is directly based from [Subscriptions with fixed price](https://github.com/stripe-samples/subscription-use-cases/tree/master/fixed-price-subscriptions/)

  - The code used in the `StripeMeteredUsageController` is directly based from [Subscriptions with metered usage](https://github.com/stripe-samples/subscription-use-cases/tree/master/usage-based-subscriptions)

- The Webhooks are consumed in the stripe service with the help of the `@StripeWebhookHandler` decorator.
