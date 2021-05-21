# Just a little test to try to implement Stripe with Nestjs

- Code Still not complete and not presentable 😎

- And more importantly, there is no tests.

- Some manual tests were done for the webhooks

- This is a basic Nestjs project, so to run it just use `npm run start:dev`.

## Libs used

- "[Nestjs](https://github.com/nestjs/nest)": "^7.6.15",

- "[Stripe Node.js Library](https://github.com/stripe/stripe-node)": "^8.148.0"

- "[@golevelup/nestjs-stripe](https://github.com/golevelup/nestjs/tree/master/packages/stripe)": "^0.2.0",

- "[@golevelup/nestjs-webhooks](https://github.com/golevelup/nestjs/tree/master/packages/webhooks)": "^0.2.7",

## Notes

- The whole stripe code is in the `StripeAppModule`.

- There are 5 different controllers and "main" routes each with its own service (used at this time only for the Webhooks), implementing different strategies:

  - The code used in the `StripeCheckoutController` is directly based from [Using Checkout for subscriptions](https://github.com/stripe-samples/checkout-single-subscription/).

  - The code used in the `StripeFixedPriceController` is directly based from [Subscriptions with fixed price](https://github.com/stripe-samples/subscription-use-cases/tree/master/fixed-price-subscriptions/).

  - The code used in the `StripeMeteredUsageController` is directly based from [Subscriptions with metered usage](https://github.com/stripe-samples/subscription-use-cases/tree/master/usage-based-subscriptions).

  - The code used in the `StripePerSeatController` is directly based from [Subscriptions with per seat pricing](https://github.com/stripe-samples/subscription-use-cases/tree/master/per-seat-subscriptions).

  - The code used in the `StripeMultiplePlanController` is directly based from [Stripe Billing sample subscribing a customer to multiple products](https://github.com/stripe-samples/charging-for-multiple-plan-subscriptions).

- The Webhooks are consumed in the stripe services with the help of the `@StripeWebhookHandler` decorator.

- Leave only one service as a provider in the module by uncommenting it (comment the others) to avoid to much confusion.

- The route for the Webhooks is `stripe/webhook`.

- Rename `.env.example` to `.env` and change the stripe keys.

- Since this is just a test (with minimal effort ...) and in with the objective of separating a little the code of the different subscription strategies without creating different repo, modules or more complexity, much of the code or config is repeated.

- Each strategy has a separate config file. Many times the config is the same between them...

## TODO

- Add tests

- Errors are very generic

- Many try catch missing, although Nestjs catch them by default...

- Maybe separate module for each strategy?

- Integrate with a database. Maybe do it in a different repo in order to separate the basic "routing" implementation on its own?
