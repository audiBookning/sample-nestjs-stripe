export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  stripe: {
    apiKey: process.env.STRIPE_API_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
});
