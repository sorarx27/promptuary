import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
}

const toasts = ref<Toast[]>([])
let toastId = 0

export function useToast() {
  function showToast(message: string, type: ToastType = 'success') {
    const id = toastId++
    toasts.value.push({ id, message, type })
    
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 3000)
  }

  function success(message: string) {
    showToast(message, 'success')
  }

  function error(message: string) {
    showToast(message, 'error')
  }

  function info(message: string) {
    showToast(message, 'info')
  }

  return {
    toasts,
    success,
    error,
    info
  }
}