const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newAppointment = new Schema({

    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    doctor:{
        type: Schema.Types.ObjectId,
        ref: 'doctors'
    },

    department:{
        type: Schema.Types.ObjectId,
        ref: 'departments'
    },

    date:{
        type: Date
    },

    message:{
        type: String
    },

    status:{
        type: String,
        default: 'Active'
    }


})

module.exports = mongoose.model('appointments', newAppointment)