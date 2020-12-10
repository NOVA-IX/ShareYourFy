const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  email: {
      type: String,
      required: true
  },
  markdown: {
    type: String,
    required: true
  },
  comments:{
      type: Array,
      default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('posts',postSchema)