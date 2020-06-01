const mongoose = require('mongoose')
const RecordSchema = new mongoose.Schema({
    account_no : {
        type : String,
    },
    firstname : {
        type : String
    },
    lastname : {
        type : String
    },
    school : {
        type : String
    },
    date : {
        type : String
    },
    share : {
        type : Number
    },
    total_share : {
        type : Number
    },
    returned_share : {
        type : Number
    },
    loan : {
        type : Number
    },
    emi : {
        type : Number
    },
    total_emi : {
        type : Number
    },
    remaining_loan : {
        type : Number
    },
    interest : {
        type : Number
    },
    total_interest : {
        type : Number
    }
})

mongoose.model('RecordSchema',RecordSchema)