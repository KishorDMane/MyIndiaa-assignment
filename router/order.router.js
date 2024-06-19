const express = require('express');
const { OrderModel } = require("../module/order.module");
const { authMiddleware, authorizeRoles} = require("../Middleware/jwt.middleware");

const OrderRouter = express.Router();

// Create a new order
OrderRouter.post('/', authMiddleware, async (req, res) => {
    try {
        const { products } = req.body;
        console.log(req.body)
        const userId = req.user.userId; // Assuming userId is set in the JWT payload

        // Calculate total amount based on products
        let totalAmount = 0;
        for (const product of products) {
            totalAmount += product.quantity * product.price;
        }

        const order = new OrderModel({
            customer: userId,
            products,
            totalAmount
        });
console.log(order)
        await order.save();
        res.status(201).send(order);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all orders (admin only)
OrderRouter.get('/', authMiddleware, authorizeRoles("admin"),  async (req, res) => {
    try {
        const orders = await Order.find().populate('customer', 'email');
        res.send(orders);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get orders for a specific user
OrderRouter.get('/my-orders', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const orders = await OrderModel.find({ customer: userId }).populate('products.product', 'name price');
        console.log(orders)
        res.send(orders);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update order status (admin only)
OrderRouter.patch('/:id/status', authMiddleware , authorizeRoles("admin"),  async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        const order = await OrderModel.findByIdAndUpdate(orderId, { status, updatedAt: Date.now() }, { new: true });
        if (!order) {
            return res.status(404).send();
        }
        res.send(order);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete an order (admin only)
OrderRouter.delete('/:id', authMiddleware , authorizeRoles("admin"),  async (req, res) => {
    try {
        const orderId = req.params.id;

        const order = await OrderModel.findByIdAndDelete(orderId);
        if (!order) {
            return res.status(404).send();
        }
        res.send(order);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = { OrderRouter };
