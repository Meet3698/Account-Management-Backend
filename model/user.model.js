const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email : {
        type : String,
        unique : true
    },
    password : {
        type : String
    },
    token : {
        type : String
    },
    phone : {
        type : String,
        unique : true
    }
})

mongoose.model('UserSchema',UserSchema)