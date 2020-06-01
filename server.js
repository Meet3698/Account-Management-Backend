require('./model/db')

const express = require('express')
const port = process.env.PORT || 4000
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

const RegistrationController = require('./controller/registration.controller')
const UserController = require('./controller/user.controller')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cors())

app.use((req, res, next)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

app.use('/',RegistrationController)
app.use('/user',UserController)

app.listen(port,()=>{
    console.log("listening on "+port);
})