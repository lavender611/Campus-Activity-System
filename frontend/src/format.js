/**
 * 后端返回的是 ISO 时间（2026-12-01T09:00:00），
 * 直接渲染会把 "T" 显示出来，这里统一格式化成 "2026-12-01 09:00:00"。
 */
export function formatDateTime(value) {
  if (!value) return ''
  if (Array.isArray(value)) {
    const [y, m, d, hh = 0, mm = 0, ss = 0] = value
    const pad = (n) => String(n).padStart(2, '0')
    return `${y}-${pad(m)}-${pad(d)} ${pad(hh)}:${pad(mm)}:${pad(ss)}`
  }
  return String(value).replace('T', ' ').slice(0, 19)
}

/** el-date-picker 需要 yyyy-MM-ddTHH:mm:ss 形式的值 */
export function toPickerValue(value) {
  if (!value) return ''
  return String(value).slice(0, 19)
}
