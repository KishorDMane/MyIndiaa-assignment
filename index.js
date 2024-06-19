const express = require('express')
const mongoose = require("mongoose")
const app = express()
require("dotenv").config();
const port = process.env.PORT || 4000;
const { connection } = require("./config/config.js");
const authMiddleware = require("./Middleware/jwt.middleware.js")
const { SignupRouter } = require("./router/signup.router.js")
const { LoginRouter } = require("./router/login.router.js")

app.use(express.json())
app.get('/', authMiddleware, (req, res) => {
    res.send('Welcome to the E-commerce platform API')
})
app.use("/user", SignupRouter)
app.use("/login", LoginRouter)


app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})
