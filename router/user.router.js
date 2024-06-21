const jwt = require('jsonwebtoken');
const { userModel } = require('../models/user.module');
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const express = require('express');
require("dotenv").config();


SignupRouter = express.Router();

SignupRouter.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new userModel({ name, email, password });
        console.log(user)
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error)
        res.status(400).send({ error: 'Error registering user' });
    }
})


SignupRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).send({ error: 'Invalid email or password' });
        }

        console.log(process.env.JWT_SECRET);
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.send({ token });
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Error logging in' });
    }


})


module.exports = { SignupRouter };

