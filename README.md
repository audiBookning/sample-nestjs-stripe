# Just a little test to try to implement stripe with Nestjs

## Libs used

- "[@golevelup/nestjs-stripe](https://github.com/golevelup/nestjs/tree/master/packages/stripe)": "^0.2.0",

- "[@golevelup/nestjs-webhooks](https://github.com/golevelup/nestjs/tree/master/packages/webhooks)": "^0.2.7",

## Notes

- The whole stripe code is in the stripe.module

- In the controller the code used comes from [checkout-single-subscription](https://github.com/stripe-samples/checkout-single-subscription/)

- The webhooks are consumed in the stripe service with the help of the @StripeWebhookHandler decorator.
