// 时间展示统一在手机端做短格式处理，避免长文本换行
const WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function toDate(value) {
  if (!value) return null
  const text = String(value).replace(' ', 'T')
  const date = new Date(text)
  return Number.isNaN(date.getTime()) ? null : date
}

const pad = (n) => String(n).padStart(2, '0')

export function fmtDate(value) {
  const date = toDate(value)
  if (!date) return '-'
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

export function fmtTime(value) {
  const date = toDate(value)
  if (!date) return ''
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function fmtShort(value) {
  const date = toDate(value)
  if (!date) return '-'
  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${WEEK[date.getDay()]} ${fmtTime(value)}`
}

export function fmtRange(start, end) {
  const s = toDate(start)
  const e = toDate(end)
  if (!s) return '-'
  if (!e) return `${fmtDate(start)} ${fmtTime(start)}`
  const sameDay = s.toDateString() === e.toDateString()
  return sameDay
    ? `${fmtDate(start)} ${WEEK[s.getDay()]} ${fmtTime(start)} - ${fmtTime(end)}`
    : `${fmtDate(start)} ${fmtTime(start)} - ${fmtDate(end)} ${fmtTime(end)}`
}

export function statusText(status) {
  return status === 'REGISTERED' ? '已报名' : '已取消'
}
