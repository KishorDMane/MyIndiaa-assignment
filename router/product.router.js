const express = require('express');
const { authMiddleware, authorizeRoles } = require("../Middleware/jwt.middleware.js");
const { Product } = require("../models/product.module.js");

const productRouter = express.Router();

// Create a new product
productRouter.post('/', authMiddleware, authorizeRoles("admin"), async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).send(product);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Get all products
productRouter.get('/', authMiddleware, async (req, res) => {
    try {
        const products = await Product.find();
        res.send(products);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get a product by ID
productRouter.get('/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }
        res.send(product);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Update a product by ID
productRouter.put('/:id', authMiddleware, authorizeRoles("admin"), async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }
        res.send(product);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Delete a product by ID
productRouter.delete('/:id', authMiddleware, authorizeRoles("admin"), async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }
        res.send(product);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = { productRouter };
