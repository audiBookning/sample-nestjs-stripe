export default () => ({
  // INFO: In this case it is the same as stripeFixedPrice
  stripePerSeat: {
    // "dynamic" priceId
    basic: process.env.BASIC,
    premium: process.env.PREMIUM,
  },
});
