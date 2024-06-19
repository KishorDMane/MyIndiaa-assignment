const jwt = require('jsonwebtoken');
const {userModel} = require('../module/user.module');
const bcrypt = require('bcrypt');
const mongoose=require ("mongoose");
const express=require('express');



SignupRouter= express.Router();

SignupRouter.post("/register", async(req,res)=>{
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



module.exports={SignupRouter};