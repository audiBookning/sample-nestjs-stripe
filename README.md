# Just a little test to try to implement Stripe with Nestjs

- Code Still not complete and not presentable. 😎

- And more importantly, there is no tests.

- Some manual tests were done for the webhooks.

- This is a basic Nestjs project, so to run it just use `npm run start:dev`.

## Libs used

- "[Nestjs](https://github.com/nestjs/nest)": "^7.6.15",

- "[Stripe Node.js Library](https://github.com/stripe/stripe-node)": "^8.148.0"

- "[@golevelup/nestjs-stripe](https://github.com/golevelup/nestjs/tree/master/packages/stripe)": "^0.2.0",

- "[@golevelup/nestjs-webhooks](https://github.com/golevelup/nestjs/tree/master/packages/webhooks)": "^0.2.7",

## Notes

- The stripe code of the different subscription strategies is in 5 different modules, each with a controller managing some "main" routes and with its own service (used at this time only for the Webhooks).

- The StrategyModule is used just to dynamically load the different strategy modules depending on the env variable `STRIPE_STRATEGY`, so as to avoid well deserved instabilities when instantiating multiple times the @golevelup/nestjs-stripe module.

- Their controllers are:

  - The code used in the `StripeCheckoutController` is directly based from [Using Checkout for subscriptions](https://github.com/stripe-samples/checkout-single-subscription/).

  - The code used in the `StripeFixedPriceController` is directly based from [Subscriptions with fixed price](https://github.com/stripe-samples/subscription-use-cases/tree/master/fixed-price-subscriptions/).

  - The code used in the `StripeMeteredUsageController` is directly based from [Subscriptions with metered usage](https://github.com/stripe-samples/subscription-use-cases/tree/master/usage-based-subscriptions).

  - The code used in the `StripePerSeatController` is directly based from [Subscriptions with per seat pricing](https://github.com/stripe-samples/subscription-use-cases/tree/master/per-seat-subscriptions).

  - The code used in the `StripeMultiplePlanController` is directly based from [Stripe Billing sample subscribing a customer to multiple products](https://github.com/stripe-samples/charging-for-multiple-plan-subscriptions).

- The Webhooks are consumed in the stripe services with the help of the `@StripeWebhookHandler` decorator.

- The route for the Webhooks is `stripe/webhook`.

- Rename `.env.example` to `.env` and change the stripe keys.

- Since this is just a test (with minimal effort ...) and in with the objective of separating a little the code of the different subscription strategies without creating different repo or more complexity, much of the code or config is repeated. It will also give the easiness of latter simply copying a specific module folder to use as a quick boilerplate.

- Each strategy has a separate config file. Many times the config is the same between them...

## TODO

- Add tests.

- Errors are too generic and many try catch missing, although Nestjs catch them by default...

- Integrate with a database. Maybe do it in a different repo in order to separate the basic "routing" implementation on its own?

## Disclaimer

This code is not and will never be maintained. It is just some random sample code.

Feel free to copy and make any change you like.

##

License
ISC © 2021 AudiBookning
