import { toast as sonnerToast } from 'sonner'

interface ToastOptions {
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, options)
  },
  error: (message: string, options?: ToastOptions) => {
    return sonnerToast.error(message, options)
  },
  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.info(message, options)
  },
  warning: (message: string, options?: ToastOptions) => {
    return sonnerToast.warning(message, options)
  },
  loading: (message: string, options?: ToastOptions) => {
    return sonnerToast.loading(message, options)
  }
}

export function useToast() {
  return { toast, toasts: [] }
}