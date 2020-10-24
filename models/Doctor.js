const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newDoctor = new Schema({

    name:{
        type: String
    },

    email:{
        type: String
    },

    field:{
        type: String
    },

    intro:{
        type: String
    },

    file:{
        type: String
    },

    status:{
        type: String,
        default: 'Unactive'
    },
})

module.exports = mongoose.model('doctors', newDoctor)