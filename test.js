// executablePath：使用自己的瀏覽器開啟
// headless：是否要顯示操作介面
// userDataDir：紀錄登入資訊
// document.querySelectorAll('div.WallItem div.NotificationBody a:nth-child(2)')


const { wait, scrollDownToBottom, recordStream } = require('./util/helper')

const cp = require('child_process')
const fs = require('fs')

const config = require('./config/config.json')

const db = require('./config/mongoose')

const TwitchUsers = require('./models/twitchUsers')

const puppeteer = require('puppeteer-core');


(async () => {
  const browser = await puppeteer.launch(config.setting);
  const page = await browser.newPage();

  await page.goto(config.url.twitch, { waitUntil: 'networkidle0' });

  await scrollDownToBottom(page)

  await wait(1000)

  const streamers = await page.evaluate(_ => {
    const data = Array.from(document.querySelectorAll('a[data-a-target="preview-card-title-link"]'))
    return data.map(e => e.pathname.substring(1))
  })

  streamers.forEach(async (streamer) => {
    const user = await TwitchUsers.findOne({ userName: streamer })
    if (user && !user.isRecording) {
      console.log(`${user.userName} is streaming`)
      // user.isRecording = true
      // await user.save()

      // TODO：將bat內容改成執行20後關閉
      recordStream(fs, cp, user.userName, __dirname)
    }
  })

  await browser.close();
  await db.close()
})();


// const data = Array.from(document.querySelectorAll('a[data-a-target="preview-card-title-link"]'))

// const users = data.map(e => e.pathname.substring(1))