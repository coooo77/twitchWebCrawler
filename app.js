(async () => {
  const test = require('./test')
  const { interval } = require('./config/config.json')

  console.log('開始監控Twitch實況，輸入ctrl+c結束錄影')
  test()
  setInterval(test, interval)
})()