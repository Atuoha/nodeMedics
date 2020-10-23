const mongoose = require('mongoose')
const Schema  = mongoose.Schema


const newDept = new Schema({

    name:{
        type: String
    },

    intro:{
        type: String
    },

    content:{
        type: String
    },

    file:{
        type: String
    },

    tag:{
        type: String
    },

    date:{
        type: Date,
        default: Date.now()
    }
})


module.exports = mongoose.model('departments', newDept)