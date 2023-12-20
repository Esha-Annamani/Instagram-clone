const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const requireLogin = require('../middlewares/requireLogin')


router.post('/signup',(req,res)=>{
   const {name,email,password,pic}=req.body
   if(!email || !password || !name){
    return res.status(422).json({error:"please enter valid field"})
   }
   User.findOne({email:email})
   .then((savedUser)=>{
    if(savedUser){
        return res.status(422).json({error:"User already exist with this email"})
    }
    bcrypt.hash(password,12)
    .then(hashedPassword=>{
        const user = new User({name, email, password:hashedPassword, pic})
        user.save()
        .then((user)=>{
            return res.json({message:"User registered successfully"})
        })
        .catch((errr)=>{
            console.log(err)
        })
    })
   })
   .catch((err)=>{
    console.log(err)
   })
})

router.post('/signin',(req,res)=>{
    const{email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error : "please enter valid fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(!savedUser){
            return res.status(422).json({error: "Invalid Email or Password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message: "Successfully signed in" })
                const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
                const {_id, name, email, followers, following, pic} = savedUser
                res.json({token,user:{_id,name,email,followers,following, pic}})
            }else{
                return res.status(422).json({error: "Invalid Email or Password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })

})
module.exports=router