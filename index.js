const express = require('express')
const mongoose = require("mongoose")
const rateLimit = require('express-rate-limit');

const app = express()
require("dotenv").config();
const port = process.env.PORT || 4000;


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  keyGenerator: (req) => req.ip 
});



const { connection } = require("./config/config.js");
const { authMiddleware, authorizeRoles } = require("./Middleware/jwt.middleware.js")
const { SignupRouter } = require("./router/user.router.js")
const { productRouter } = require("./router/product.router.js")
const { OrderRouter } = require("./router/order.router.js")
const { paymentIntentRouter } = require("./router/payment.router.js")

app.use(express.json())
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message });
  }
  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(400).send({ error: 'Duplicate key error' });
  }
  res.status(500).send({ error: 'Internal Server Error' });
});

app.use(limiter);
app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce platform API')
})
app.use("/user", SignupRouter)
app.use("/product", productRouter)
app.use("/order", OrderRouter)
app.use("/pay", paymentIntentRouter)


app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
