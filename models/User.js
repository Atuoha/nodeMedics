const mongoose = require('mongoose')
const Schema = mongoose.Schema


const newUser = new Schema({

    name:{
        type: String
    },

    email:{
        type: String
    },

    password:{
        type: String
    },

    role:{
        type: String,
        defualt: 'Subscriber'
    },

    status:{
        type: String,
        default: 'Active'
    },

    date:{
        type: Date
    }


})


module.exports = mongoose.model('users', newUser)