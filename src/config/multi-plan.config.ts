export default () => ({
  stripeMultiPlan: {
    animals: process.env.ANIMALS,
    couponId: process.env.COUPON_ID,
    minProdDiscount: process.env.MIN_PRODUCTS_FOR_DISCOUNT,
    discountFactor: process.env.DISCOUNT_FACTOR,
  },
});
