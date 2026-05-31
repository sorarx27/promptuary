<script setup lang="ts">
import { XIcon } from 'lucide-vue-next'

const props = defineProps<{
  label: string
  removable?: boolean
}>()

const emit = defineEmits<{
  remove: []
  click: []
}>()

const colors = [
  'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'bg-green-500/20 text-green-400 border-green-500/30',
  'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'bg-red-500/20 text-red-400 border-red-500/30',
  'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
]

function getColor(tag: string) {
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}
</script>

<template>
  <span 
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer border transition-all hover:scale-105',
      getColor(label)
    ]"
    @click="emit('click')"
  >
    {{ label }}
    <button 
      v-if="removable"
      @click.stop="emit('remove')"
      class="hover:bg-white/10 rounded-full p-0.5 transition"
    >
      <XIcon :size="12" />
    </button>
  </span>
</template>