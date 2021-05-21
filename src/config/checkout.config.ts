export default () => ({
  stripeCheckout: {
    basicPriceId: process.env.BASIC_PRICE_ID,
    proPriceId: process.env.PRO_PRICE_ID,
    portalReturnUrl: process.env.PORTAL_RETURN_URL,
  },
});
