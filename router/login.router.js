const jwt = require('jsonwebtoken');
const { userModel } = require('../module/user.module');
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const express = require('express');



const LoginRouter = express.Router();

LoginRouter.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).send({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, 'secretKey', { expiresIn: '1h' });
        res.send({ token });
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Error logging in' });
    }


})

module.exports = { LoginRouter };