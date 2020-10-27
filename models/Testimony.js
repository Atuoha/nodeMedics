const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newTestimony =  new Schema({

    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    field:{
        type: String
    },

    message:{
        type: String
    }
})

module.exports = mongoose.model('testimonies', newTestimony)