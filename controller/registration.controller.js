const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('UserSchema')

router.post("/register",async(req,res)=>{
    const data = req.body

    const user = new User({
        email : data.email,
        password : data.password,
        token : "",
        phone : data.phone
    })

    await user.save((err)=>{
        if(err)
        {
            if(err.keyPattern.email == 1)
            {
                res.send("Email")
            }  
            if(err.keyPattern.phone == 1)
            {
                res.send("Phone")
            }
        }
        else
        {
            res.send("Success")
        }
    })
})

router.post("/login",async(req,res)=>{
    if(req.body.email=="admin@admin.com" && req.body.password == "password")
    {
        res.send("Admin")
    }
    else{
        const data = await User.collection.findOne({email:req.body.email})
        if(data!=null)
        {
            if(data.password == req.body.password)
            {
                res.send("Success")
            }
            else{
                res.send("Invalid Credentials")
            }
        }
        else{
            res.send("Email is not Registered")
        }
    }
})

module.exports = router