const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userDataSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  isRecording: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('twitchUsers', userDataSchema)