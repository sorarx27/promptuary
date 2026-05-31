<script setup lang="ts">
import { useToast } from '../composables/useToast'

const { toasts } = useToast()

function getToastColor(type: string) {
  switch (type) {
    case 'success':
      return 'bg-green-600'
    case 'error':
      return 'bg-red-600'
    case 'info':
      return 'bg-blue-600'
    default:
      return 'bg-gray-600'
  }
}
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 space-y-2">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="[
        'px-4 py-3 rounded-lg shadow-lg text-white min-w-64 animate-slide-in',
        getToastColor(toast.type)
      ]"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
</style>