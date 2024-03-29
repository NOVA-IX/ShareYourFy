const mongoose = require('mongoose')
// const Joi = require('joi')

const TextbookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    description: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100
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
    imageUrl: {
        type: Array,
        required: true
    },
    price: {
        type: String
    },
    uploadedAt:{
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('textbook',TextbookSchema)
