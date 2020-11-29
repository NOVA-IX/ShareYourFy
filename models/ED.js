const mongoose = require('mongoose')
// const Joi = require('joi')

const EdSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    contact: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255
    },
    instruments: {
        type: Array,
        required: true
    },
    uploadedAt:{
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Ed',EdSchema)
