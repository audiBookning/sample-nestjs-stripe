export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  domain: process.env.DOMAIN,
  // Common stripe env
  stripe: {
    apiKey: process.env.STRIPE_API_KEY,
    publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  stripeCheckout: {
    basicPriceId: process.env.BASIC_PRICE_ID,
    proPriceId: process.env.PRO_PRICE_ID,
    portalReturnUrl: process.env.PORTAL_RETURN_URL,
  },
  stripeFixedPrice: {
    // "dynamic" newPriceLookupKey
    basic: process.env.BASIC,
    premium: process.env.PREMIUM,
  },
  // INFO: In this case it is the same as stripeFixedPrice
  stripeMeteredUsage: {
    // "dynamic" priceId
    basic: process.env.BASIC,
    premium: process.env.PREMIUM,
  },
  // INFO: In this case it is the same as stripeFixedPrice
  stripePerSeat: {
    // "dynamic" priceId
    basic: process.env.BASIC,
    premium: process.env.PREMIUM,
  },
});
