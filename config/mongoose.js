// 連線資料庫MongoDB
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/puppeteer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

module.exports = db