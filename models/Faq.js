const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newFaq = new Schema({

    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    question:{
        type: String
    },

    tag:{
        type: String
    },

    answer:{
        type: String
    }


})

module.exports = mongoose.model('faqs', newFaq)