// 轻量交互层：小程序原生 toast 与 modal，替代 H5 版自绘 toast / 底部弹窗

function toast(message, type) {
  const title = String(message == null ? '' : message)
  if (!title) return
  wx.showToast({
    title: title.length > 40 ? title.slice(0, 40) + '…' : title,
    icon: 'none',
    duration: 2200,
    mask: false
  })
}

toast.success = function (message) {
  toast(message, 'success')
}
toast.error = function (message) {
  toast(message, 'error')
}
toast.warning = function (message) {
  toast(message, 'warning')
}

// 返回 Promise<boolean>，用法与原版 askConfirm 一致
function askConfirm(message, title) {
  return new Promise(function (resolve) {
    wx.showModal({
      title: title || '提示',
      content: String(message || ''),
      confirmText: '确定',
      cancelText: '取消',
      confirmColor: '#173b67',
      success: function (res) {
        resolve(!!res.confirm)
      },
      fail: function () {
        resolve(false)
      }
    })
  })
}

module.exports = { toast: toast, askConfirm: askConfirm }
