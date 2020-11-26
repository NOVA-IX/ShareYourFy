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
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255
    },
    description: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Ed',EdSchema)
