<script setup lang="ts">
import { AlertTriangleIcon } from 'lucide-vue-next'

const props = defineProps<{
  show: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <div 
    v-if="show" 
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
    @click.self="emit('cancel')"
  >
    <div class="bg-gray-800 rounded-xl p-6 w-96 max-w-full mx-4 shadow-2xl border border-gray-700 animate-fadeIn">
      <div v-if="danger" class="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center mb-4 border border-red-600/30">
        <AlertTriangleIcon :size="24" class="text-red-500" />
      </div>
      
      <h2 class="text-xl font-bold mb-2 text-white">{{ title }}</h2>
      <p class="text-gray-300 mb-6">{{ message }}</p>
      
      <div class="flex gap-3">
        <button 
          @click="emit('cancel')"
          class="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium"
        >
          {{ cancelText || 'Cancel' }}
        </button>
        <button 
          @click="emit('confirm')"
          :class="[
            'flex-1 px-4 py-2.5 rounded-lg font-medium',
            danger 
              ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20' 
              : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20'
          ]"
        >
          {{ confirmText || 'Confirm' }}
        </button>
      </div>
    </div>
  </div>
</template>