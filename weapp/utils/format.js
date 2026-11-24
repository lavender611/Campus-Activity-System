// 时间展示统一做短格式处理，避免窄屏换行
const WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function toDate(value) {
  if (!value) return null
  const text = String(value).replace(' ', 'T')
  const date = new Date(text)
  if (isNaN(date.getTime())) return null
  return date
}

function pad(n) {
  return String(n).padStart(2, '0')
}

function fmtDate(value) {
  const date = toDate(value)
  if (!date) return '-'
  return (date.getMonth() + 1) + '月' + date.getDate() + '日'
}

function fmtTime(value) {
  const date = toDate(value)
  if (!date) return ''
  return pad(date.getHours()) + ':' + pad(date.getMinutes())
}

function fmtShort(value) {
  const date = toDate(value)
  if (!date) return '-'
  return pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + WEEK[date.getDay()] + ' ' + fmtTime(value)
}

function fmtRange(start, end) {
  const s = toDate(start)
  const e = toDate(end)
  if (!s) return '-'
  if (!e) return fmtDate(start) + ' ' + fmtTime(start)
  const sameDay = s.toDateString() === e.toDateString()
  if (sameDay) {
    return fmtDate(start) + ' ' + WEEK[s.getDay()] + ' ' + fmtTime(start) + ' - ' + fmtTime(end)
  }
  return fmtDate(start) + ' ' + fmtTime(start) + ' - ' + fmtDate(end) + ' ' + fmtTime(end)
}

function statusText(status) {
  return status === 'REGISTERED' ? '已报名' : '已取消'
}

module.exports = { fmtDate, fmtTime, fmtShort, fmtRange, statusText }
