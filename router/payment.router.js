const express = require("express");
require('dotenv').config();
const { stripe } = require("../services/services.stripe");
const { authMiddleware, authorizeRoles } = require("../Middleware/jwt.middleware");
const { OrderModel } = require("../models/order.module");
const { PaymentModel } = require("../models/Payment.module");

const paymentIntentRouter = express.Router();

paymentIntentRouter.post("/create_intent", authMiddleware, async (req, res) => {
    const { amount, currency, orderId } = req.body;

    if (!amount || !currency || !orderId) {
        return res.status(400).json({ message: "Amount, currency, and order ID are required." });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        const payment = new PaymentModel({
            orderId,
            paymentIntentId: paymentIntent.id,
            amount,
            currency,
            status: 'created'
        });
        await payment.save();

        res.status(201).json(paymentIntent);
    } catch (error) {
        handleStripeError(res, error, 'Error creating payment intent');
    }
});

paymentIntentRouter.post("/capture_intent/:id", authMiddleware, async (req, res) => {
    const { id: intentId } = req.params;

    if (!intentId) {
        return res.status(400).json({ message: "Payment Intent ID is required." });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(intentId);

        await PaymentModel.findOneAndUpdate({ paymentIntentId: intentId }, {
            status: paymentIntent.status,
            updatedAt: Date.now()
        });

        res.status(200).json(paymentIntent);
    } catch (error) {
        handleStripeError(res, error, 'Error capturing payment intent');
    }
});

paymentIntentRouter.post("/create_refund/:id", authMiddleware, authorizeRoles("admin"), async (req, res) => {
    const { id: intentId } = req.params;
    if (!intentId) {
        return res.status(400).json({ message: "Payment Intent ID is required." });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(intentId);

        const refund = await stripe.refunds.create({
            payment_intent: intentId,
        });

        await PaymentModel.findOneAndUpdate({ paymentIntentId: intentId }, {
            status: 'refunded',
            updatedAt: Date.now()
        });

        res.status(201).json(refund);
    } catch (error) {
        handleStripeError(res, error, 'Error creating refund');
    }
});

paymentIntentRouter.get("/get_intents", authMiddleware, authorizeRoles("admin"), async (req, res) => {
    try {
        const paymentIntents = await stripe.paymentIntents.list({ limit: 3 });
        res.status(200).json(paymentIntents);
    } catch (error) {
        handleStripeError(res, error, 'Error retrieving payment intents');
    }
});

function handleStripeError(res, error, defaultMessage) {
    console.error(defaultMessage, error);
    if (error.type === 'StripeAuthenticationError') {
        res.status(401).json({ message: error.message });
    } else if (error.type === 'StripeInvalidRequestError') {
        res.status(400).json({ message: error.message });
    } else if (error.type === 'StripeAPIError') {
        res.status(502).json({ message: error.message });
    } else if (error.type === 'StripeConnectionError') {
        res.status(503).json({ message: error.message });
    } else if (error.type === 'StripeRateLimitError') {
        res.status(429).json({ message: error.message });
    } else {
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { paymentIntentRouter };
