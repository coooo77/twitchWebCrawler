const mongoose = require('mongoose')
const Schema = mongoose.Schema

const streamingUsersSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('streamingUsers', streamingUsersSchema)