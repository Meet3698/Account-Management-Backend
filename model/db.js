const mongoose = require('mongoose')
mongoose.connect("API",{useNewUrlParser:true},(err)=>{
    if(!err) console.log('connected!');
    else console.log(err);
})

require('./user.model')
require('./client.model')
require('./record.model')
require('./school.model')
