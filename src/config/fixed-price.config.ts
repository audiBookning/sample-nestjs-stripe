export default () => ({
  stripeFixedPrice: {
    // "dynamic" newPriceLookupKey
    basic: process.env.BASIC,
    premium: process.env.PREMIUM,
  },
});
