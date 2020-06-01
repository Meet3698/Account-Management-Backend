const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Client = mongoose.model('ClientSchema')
const Record = mongoose.model('RecordSchema')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const User = mongoose.model('UserSchema')
const School = mongoose.model('SchoolSchema')

router.post('/getuser',async(req,res)=>{
    const record = await Record.collection.find({account_no:req.body.account_no}).toArray()
    res.send(record)
})

router.post('/getclient',async(req,res)=>{
    const client = await Client.collection.find({account_no : req.body.account_no}).toArray()
    res.send(client)
})

router.post('/updateclient',async(req,res)=>{
    const client = await Client.collection.find({account_no : req.body.account_no}).toArray()
    const school = await School.collection.find({school : req.body.school.toLowerCase()}).toArray()

    const share = parseInt(req.body.share)
    const returned_share = parseInt(req.body.returned_share)
    const loan = parseInt(req.body.loan)
    const emi = parseInt(req.body.emi)
    const interest = parseInt(req.body.interest)
    const total_share = client[0].total_share + parseInt(req.body.share) - returned_share
    let total_emi = client[0].total_emi + parseInt(req.body.emi)
    let remaining_loan = loan - total_emi
    const total_interest = client[0].total_interest + parseInt(req.body.interest)
    const swts = school[0].total_share + share
    const swte = school[0].total_emi + emi
    const swti = school[0].total_interest + interest
    const swt = swts + swte + swti

    if(remaining_loan <= 0)
    {
        remaining_loan = 0
    }
    if(total_emi >= loan)
    {
        total_emi = loan
    }

    await School.collection.update(
        {school : req.body.school.toLowerCase()},
        {$set : {
            total_share : swts,
            total_emi : swte,
            total_interest : swti,
            total : swt
        }}
    )

    const record = new Record({
        account_no : req.body.account_no,
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        school : req.body.school.toLowerCase(),
        date : req.body.date,
        share : share,
        total_share : total_share,
        returned_share : returned_share,
        loan : loan,
        emi : emi,
        total_emi : total_emi,
        remaining_loan : remaining_loan,
        interest : interest,
        total_interest : total_interest
    })

    await record.save()

    const update = await Client.collection.update(
        {account_no : req.body.account_no},
        {$set : {
            date : req.body.date,
            share : share,
            total_share : total_share,
            returned_share : returned_share,
            loan : loan,
            emi : emi,
            total_emi : total_emi,
            remaining_loan : remaining_loan,
            interest : interest,
            total_interest : total_interest
        }
    }
    )
    res.send(update)
})

router.post('/addclient',async(req,res)=>{

    const client = new Client({
        account_no : req.body.account_no,
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        school : req.body.school.toLowerCase(),   
        date : "",
        share : 0,
        total_share : 0,
        returned_share : 0,
        loan : 0,
        emi : 0,
        total_emi : 0,
        remaining_loan : 0,
        interest : 0,
        total_interest : 0
    })

    const school = await School.collection.find({school:req.body.school.toLowerCase()}).toArray()
    if(school.length===0)
    {
        const newSchool = new School({
            school : req.body.school.toLowerCase(),
            total_share : 0,
            total_emi : 0,
            total_interest : 0,
            total : 0
        })

        await newSchool.save()
    }

    await client.save((err)=>{
        if(err)
        {
            if(err.keyPattern.account_no == 1)
            {
                res.send("Account")
            }  
        }
        else
        {
            res.send("Success")
        }
    })
})

router.get('/getallclient',async(req,res)=>{
    const client = await Client.collection.find().toArray()
    res.send(client)
})

router.post('/resetpassword',async(req,res)=>{
    console.log(req.body.email);
    const user = await User.collection.find({email:req.body.email})
    if(user.length === 0)
    {
        res.send("Not Found")
    }
    else
    {
        const emailToken = crypto.randomBytes(20).toString('hex')
        await User.collection.update({email : req.body.email},
            {$set : {token:emailToken}})

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dutchman5972',
                pass: 'lsmgeipjwdjwslmw'
            }
            });

        var mailOptions = {
        from: 'dutchman5972@gmail.com',
        to: req.body.email,
        subject: "Link To Reset Password",
        text: 
        "You are recieving this because you (or someone else) have requested the reset of the password for your account.\n\n"+
        "Please click on the following link, or paste this into your browser to complete the process within one hour of recieving it:\n\n"+
        `https://front-account.herokuapp.com/resetpassword/${emailToken}`+
        "\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n"
        }

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                res.send("Sent")
            }
        })  
    }
})

router.post("/reset",(req,res)=>{
    User.findOne({token:req.body.token}).then(user=>{
        if(user!=null)
        {
            res.send(user.email)
        }
        else
        {
            res.send("fail")
        }
    })
})

router.post("/updatepassword",(req,res)=>{
    console.log(req.body);
    User.update(
        {email : req.body.email},
        {$set : {password : req.body.password}}
    ).then(result=>{
        console.log(result.ok);
        
        if(result.ok===1)
        {
            res.send("password updated")
        }
        else
        {
            res.send("error")
        }
    })
})

router.post("/editclient",async(req,res)=>{
    const client = await Client.collection.find({account_no:req.body.account_no}).toArray()
    
    if(client.length === 0)
    {
        res.send("Not Found")
    }
    else
    {
        if(req.body.firstname!="")
        {
            await Client.collection.update({account_no : req.body.account_no},
                {$set : {firstname : req.body.firstname}})
            await Record.collection.updateMany({account_no : req.body.account_no},
                {$set : {firstname : req.body.firstname}})
        }
        else if(req.body.lastname!="")
        {
            await Client.collection.update({account_no : req.body.account_no},
                {$set : {lastname : req.body.lastname}})
            await Record.collection.updateMany({account_no : req.body.account_no},
                {$set : {lastname : req.body.lastname}})
        }
        else if(req.body.school!="")
        {
            await Client.collection.update({account_no : req.body.account_no},
                {$set : {school : req.body.school.toLowerCase()}})
            await Record.collection.updateMany({account_no : req.body.account_no},
                {$set : {school : req.body.school.toLowerCase()}})
        }
        else
        {
            return res.send("fail")
        }
            
        return res.send("Success")
    }            
})

router.post("/schooltotal",async(req,res)=>{
    const school = await School.collection.find().toArray()
    if(school.length === 0)
    {
        res.send("No Record Found")
    }
    else
    {
        res.send(school)
    }
})

router.post("/deleteentry",async(req,res)=>{
    const client = await Client.collection.find({account_no:req.body.account_no}).toArray()

    if(client.length===0){
        res.send("No Entry Found")
    }
    else{
        const total_share = client[0].total_share - parseInt(req.body.share) + parseInt(req.body.returned_share)
        let total_emi = client[0].total_emi - parseInt(req.body.emi)
        let remaining_loan = client[0].remaining_loan + parseInt(req.body.emi)
        const total_interest = client[0].total_interest - parseInt(req.body.interest)

        await Client.collection.update(
            {account_no : req.body.account_no},
            {$set : {
                date : "",
                share : 0,
                total_share : total_share,
                returned_share : 0,
                emi : 0,
                interest : 0,
                total_emi : total_emi,
                remaining_loan : remaining_loan,
                total_interest : total_interest
            }
        }
        )

        await Record.collection.deleteMany({$and:[{account_no:req.body.account_no,date:req.body.date}]})

        res.send("Success")
    }
})


router.post("/deleteuser",async(req,res)=>{
    await Client.collection.deleteOne({account_no:req.body.account_no})
    await Record.collection.deleteMany({account_no:req.body.account_no})
    res.send("Success")
})

module.exports = router