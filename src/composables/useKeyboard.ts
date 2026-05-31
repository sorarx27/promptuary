import { onMounted, onUnmounted } from 'vue'

export function useKeyboard(handlers: Record<string, () => void>) {
  function handleKeyDown(event: KeyboardEvent) {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    const modifier = isMac ? event.metaKey : event.ctrlKey

    // Ctrl/Cmd + N - New prompt
    if (modifier && event.key === 'n') {
      event.preventDefault()
      handlers.newPrompt?.()
    }

    // Ctrl/Cmd + S - Save
    if (modifier && event.key === 's') {
      event.preventDefault()
      handlers.save?.()
    }

    // Ctrl/Cmd + F - Focus search
    if (modifier && event.key === 'f') {
      event.preventDefault()
      handlers.focusSearch?.()
    }

    // Ctrl/Cmd + K - Copy prompt
    if (modifier && event.key === 'k') {
      event.preventDefault()
      handlers.copy?.()
    }

    // Escape - Close modals
    if (event.key === 'Escape') {
      handlers.escape?.()
    }

    // Ctrl/Cmd + E - Export
    if (modifier && event.key === 'e') {
      event.preventDefault()
      handlers.export?.()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
}