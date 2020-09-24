const db = require('../../config/mongoose')
const TwitchUsersSchema = require('../twitchUsers')
const userData = require('./twitchUsers.json').users

try {
  db.once('open', async () => {
    console.log('MongoDB Connected')
    await TwitchUsersSchema.create(userData)
    console.log('Data installed')
    await db.close()
  })
} catch (error) {
  console.error(error)
}