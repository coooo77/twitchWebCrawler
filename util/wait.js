// 等一下
function wait(ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms))
}

module.exports = wait