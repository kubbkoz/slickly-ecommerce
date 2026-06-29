interface ToastItem {
  id: number
  message: string
  icon: string
}

const toasts = ref<ToastItem[]>([])
let nextId = 0

export function useToast() {
  function show(message: string, icon = 'check_circle') {
    if (!import.meta.client) return
    const id = nextId++
    toasts.value.push({ id, message, icon })
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 2800)
  }
  return { toasts, show }
}
