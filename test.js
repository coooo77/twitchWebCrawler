// executablePath：使用自己的瀏覽器開啟
// headless：是否要顯示操作介面
// userDataDir：紀錄登入資訊
// document.querySelectorAll('div.WallItem div.NotificationBody a:nth-child(2)')

// 等一下
function wait(ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms))
}

const config = {
  setting: {
    executablePath:
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    headless: false,
    userDataDir: "./userData"
  },
  url: {
    pixiv: 'https://sketch.pixiv.net/notifications',
    twitch: 'https://www.twitch.tv/directory/following/live'
  }
}

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

const puppeteer = require('puppeteer-core');


(async () => {
  const browser = await puppeteer.launch(config.setting);
  const page = await browser.newPage();

  await page.goto(config.url.twitch);

  await wait(1000)

  const users = await page.evaluate(test => {
    const data = Array.from(document.querySelectorAll('a[data-a-target="preview-card-title-link"]'))
    return data.map(e => e.pathname.substring(1))
  })

  await browser.close();
  await db.close()
})();


// const data = Array.from(document.querySelectorAll('a[data-a-target="preview-card-title-link"]'))

// const users = data.map(e => e.pathname.substring(1))