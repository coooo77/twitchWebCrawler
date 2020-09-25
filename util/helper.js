const helper = {
  wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms))
  },
  async scrollDownToBottom(page) {
    // Get the height of the rendered page
    const bodyHandle = await page.$('main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content > div')
    const { height } = await bodyHandle.boxModel()
    await bodyHandle.dispose()

    // Scroll one viewport at a time, pausing to let content load
    const viewportHeight = page.viewport().height
    let viewportIncr = 0

    while (viewportIncr + viewportHeight < height) {
      await page.evaluate(_viewportHeight => {
        const target = document.querySelector('main > div.root-scrollable.scrollable-area > div.simplebar-scroll-content')
        target.scrollBy(0, _viewportHeight)
      }, viewportHeight)
      await helper.wait(20)
      viewportIncr = viewportIncr + viewportHeight
    }
  },
  recorderMaker(name) {
    return `
    :loop
    set hour=%time:~0,2%
    if "%hour:~0,1%" == " " set hour=0%hour:~1,1%
    set name=${name}
    streamlink --twitch-disable-hosting https://www.twitch.tv/%name% best -o D://JD\\%name%_twitch_%DATE%_%hour%%time:~3,2%%time:~6,2%.mp4
    timeout /t 30
    goto loop
    `
  },
  recordStream(fs, cp, userName, dirName) {
    // 檢查是否有錄製的bat檔案
    // 有的話以cp執行 TODO：將bat內容改成執行20後關閉
    // 沒有就以fs製作一個bat類型錄製檔案，接著執行cp
    fs.access(`./recorder/${userName}.bat`, fs.constants.F_OK, (err) => {

      console.log(`file ${userName}.bat ${err ? 'does not exist' : 'exists'}`)

      if (err) {
        console.log(`create ${userName}.bat`)
        fs.writeFile(`./recorder/${userName}.bat`, helper.recorderMaker(userName), (error) => {
          console.log(error);
        })
      }

      console.log(`start to record streamer ${userName}`)

      // console.log('commands', commands)
      const commands = cp.exec('start ' + dirName + `\\recorder\\${userName}.bat`, (error, stdout, stderr) => {
        if (error) {
          console.log(`Name: ${error.name}\nMessage: ${error.message}\nStack: ${error.stack}`)
        }
      })
      process.on('exit', function () {
        console.log(`${userName}'s record process killed`)
        commands.kill()
      })
    })
  }
}

module.exports = helper