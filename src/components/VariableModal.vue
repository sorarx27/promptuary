<script setup lang="ts">
import { ref, computed } from 'vue'
import { XIcon, CopyIcon } from 'lucide-vue-next'

const props = defineProps<{
  content: string
  show: boolean
}>()

const emit = defineEmits<{
  close: []
  copy: [content: string]
}>()

const detectedVariables = computed(() => {
  const regex = /\{\{([^}]+)\}\}/g
  const matches = props.content.matchAll(regex)
  return [...new Set(Array.from(matches, m => m[1].trim()))]
})

const variableValues = ref<Record<string, string>>({})

if (props.show) {
  variableValues.value = detectedVariables.value.reduce((acc, v) => {
    acc[v] = ''
    return acc
  }, {} as Record<string, string>)
}

function copyWithVariables() {
  let content = props.content
  
  detectedVariables.value.forEach(variable => {
    const value = variableValues.value[variable] || `{{${variable}}}`
    content = content.replaceAll(`{{${variable}}}`, value)
  })
  
  emit('copy', content)
}

function cancel() {
  variableValues.value = {}
  emit('close')
}
</script>

<template>
  <div 
    v-if="show" 
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
    @click.self="cancel"
  >
    <div class="bg-gray-800 rounded-xl p-6 w-[480px] max-w-full mx-4 shadow-2xl border border-gray-700 animate-fadeIn">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-white">Fill Variables</h2>
        <button 
          @click="cancel"
          class="p-1.5 hover:bg-gray-700 rounded-lg transition"
        >
          <XIcon :size="20" class="text-gray-400" />
        </button>
      </div>
      
      <p class="text-sm text-gray-400 mb-6">Fill in the values for these variables before copying:</p>
      
      <div class="space-y-4 mb-6 max-h-96 overflow-y-auto">
        <div v-for="variable in detectedVariables" :key="variable">
          <label class="block text-sm font-medium mb-2 text-gray-300">
            {{ variable }}
          </label>
          <input 
            v-model="variableValues[variable]"
            type="text"
            class="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-blue-500"
            :placeholder="`Enter value for ${variable}...`"
          />
        </div>
      </div>
      
      <div class="flex gap-3">
        <button 
          @click="cancel"
          class="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium"
        >
          Cancel
        </button>
        <button 
          @click="copyWithVariables"
          class="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
        >
          <CopyIcon :size="18" />
          Copy
        </button>
      </div>
    </div>
  </div>
</template>