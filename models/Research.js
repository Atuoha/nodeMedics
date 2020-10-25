const mongoose = require('mongoose')
const Schema  = mongoose.Schema


const newLab = new Schema({

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

    location:{
        type: String
    },

    estDate:{
        type: String
    },

    status:{
        type: Boolean,
        default: false
    }

})


module.exports = mongoose.model('researches', newLab)