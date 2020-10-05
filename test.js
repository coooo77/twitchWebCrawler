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
const StreamingUsers = require('./models/streamingUsers')


const test = async (browser) => {
  const page = await browser.newPage();
  try {
    await page.goto(config.url.twitch, { waitUntil: 'networkidle0' })
    await scrollDownToBottom(page)
    await wait(500)
    await scrollDownToBottom(page)
    await wait(500)
    const streamers = await page.evaluate(_ => {
      const data = Array.from(document.querySelectorAll('a[data-a-target="preview-card-title-link"]'))
      return data.map(e => e.pathname.substring(1))
    })

    // 檢查是否有實況主下線，是的話把isRecording改為false
    console.log('\n[System] status check')
    const streamingUsers = await StreamingUsers.find()
    if (streamingUsers.length !== 0) {
      const streamingUsersList = streamingUsers.map(user => user.userName)
      streamingUsersList.forEach(async (streamer) => {
        console.log(`Check ${streamer}'s streaming status`)
        if (!streamers.includes(streamer)) {
          console.log(`${streamer} is offline, start to close recording`)
          const user = await TwitchUsers.findOne({ userName: streamer })
          user.isRecording = false
          await user.save()

          const streamingUser = await StreamingUsers.findOne({ userName: streamer })
          await streamingUser.remove()
        } else {
          console.log(`${streamer} is still streaming`)
        }
      })
    } else {
      console.log('No target user streaming')
    }

    // 開始檢查現在實況主中是否有想要錄製的對象，有的話就開始錄影
    console.log('[System] Record check')
    streamers.forEach(async (streamer) => {
      const user = await TwitchUsers.findOne({ userName: streamer })
      if (user && !user.isRecording) {
        console.log(`${user.userName} is streaming`)

        // 開始錄製，更改狀態
        user.isRecording = true
        await user.save()

        // 更新正在實況的實況主清單
        const newStreamingUser = new StreamingUsers({ userName: streamer })
        await newStreamingUser.save()

        // TODO：將bat內容改成執行20後關閉
        await recordStream(fs, cp, user.userName, __dirname)
      }
    })
    await wait(1000)
  } catch (error) {
    console.log(error.name + ': ' + error.message)
  } finally {
    await page.close()
    // 不能關閉資料庫，不然每次監控都要重開
    // await db.close()
  }
}

module.exports = test