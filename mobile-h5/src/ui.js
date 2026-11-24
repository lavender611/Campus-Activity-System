import { reactive } from 'vue'

// 轻量交互层：替代原 Element Plus 的 ElMessage / ElMessageBox，适配手机尺寸
export const ui = reactive({
  toasts: [],
  confirm: null
})

let seq = 0

export function toast(message, type = 'info', duration = 2200) {
  const id = ++seq
  ui.toasts.push({ id, message, type })
  setTimeout(() => {
    const index = ui.toasts.findIndex((t) => t.id === id)
    if (index > -1) ui.toasts.splice(index, 1)
  }, duration)
}

toast.success = (message) => toast(message, 'success')
toast.error = (message) => toast(message, 'error')
toast.warning = (message) => toast(message, 'warning')

export function askConfirm(message, title = '提示') {
  return new Promise((resolve) => {
    ui.confirm = { message, title, resolve }
  })
}

export function resolveConfirm(value) {
  if (!ui.confirm) return
  ui.confirm.resolve(value)
  ui.confirm = null
}
