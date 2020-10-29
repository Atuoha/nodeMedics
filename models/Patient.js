const mongoose = require('mongoose')
const Schema = mongoose.Schema


const newPatient = new Schema({

    name:{
        type: String
    },

    email:{
        type: String
    },

    discharge_date:{
        type: Date
    },

    entry_date:{
        type: Date,
    },

    phone:{
        type: String
    },

    file:{
        type: String
    },

    note:{
        type: String
    },

    status:{
        type: String,
        default: 'Active'
    }

  


})


module.exports = mongoose.model('patients', newPatient)