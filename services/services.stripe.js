const Stripe = require('stripe');
const dotenv = require('dotenv');

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
console.log("connected to stripe")

module.exports = { stripe };