const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newService = new Schema({
    name:{
        type: String
    },

    font:{
        type: String
    },

    content:{
        type: String
    }


})

module.exports = mongoose.model('services', newService)