const mongoose = require('mongoose')

const SchoolSchema = new mongoose.Schema({
    school : {
        type : String
    },
    total_share : {
        type : Number
    },
    total_emi : {
        type : Number
    },
    total_interest : {
        type : Number
    },
    total : {
        type : Number
    }
})

mongoose.model('SchoolSchema',SchoolSchema)