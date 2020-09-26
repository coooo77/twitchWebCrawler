const config = require('./config/config.json')
const puppeteer = require('puppeteer-core');
(async () => {
  const test = require('./test')
  const { interval } = require('./config/config.json')
  console.log('開始監控Twitch實況')
  const browser = await puppeteer.launch(config.setting);
  let count = 1
  test(browser)
  setInterval(function () {
    console.log(`\n第${count++}次執行檢查，輸入ctrl+c結束錄影 ${new Date().toLocaleString()}`)
    test(browser)
  }, interval)
})()