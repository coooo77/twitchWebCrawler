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
  }
}

module.exports = helper