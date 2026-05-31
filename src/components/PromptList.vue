<script setup lang="ts">
import { ref } from 'vue'
import { SearchIcon, PlusIcon } from 'lucide-vue-next'
import Tag from './Tag.vue'
import { parseTags } from '../db'

const props = defineProps<{
  prompts: any[]
  selectedPrompt: any | null
  searchQuery: string
}>()

const emit = defineEmits<{
  selectPrompt: [prompt: any]
  createPrompt: []
  'update:searchQuery': [value: string]
  filterByTag: [tag: string]
}>()

const searchInput = ref<HTMLInputElement | null>(null)

function focusSearch() {
  searchInput.value?.focus()
}

defineExpose({
  focusSearch
})
</script>

<template>
  <div class="w-96 bg-gray-900 border-r border-gray-800 flex flex-col">
    <!-- Search Header -->
    <div class="p-4 border-b border-gray-800">
      <div class="relative">
        <SearchIcon :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input 
          ref="searchInput"
          :value="searchQuery"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          type="text" 
          placeholder="Search prompts..." 
          class="w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-blue-500 placeholder-gray-500"
        />
      </div>
      <button 
        @click="emit('createPrompt')"
        class="w-full mt-3 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
        title="New Prompt (Ctrl+N)"
      >
        <PlusIcon :size="18" />
        New Prompt
      </button>
    </div>

    <!-- Prompt List -->
    <div class="flex-1 overflow-y-auto p-3 space-y-2">
      <div 
        v-if="prompts.length === 0"
        class="flex flex-col items-center justify-center h-full text-gray-500 text-center p-8"
      >
        <SearchIcon :size="48" class="mb-4 opacity-50" />
        <p class="text-sm">No prompts found</p>
        <p class="text-xs mt-1">Create one to get started!</p>
      </div>
      
      <div 
        v-for="prompt in prompts" 
        :key="prompt.id"
        @click="emit('selectPrompt', prompt)"
        :class="[
          'p-4 rounded-lg cursor-pointer border transition-all animate-fadeIn',
          selectedPrompt?.id === prompt.id 
            ? 'bg-gray-800 border-blue-500 shadow-lg shadow-blue-500/10' 
            : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800 hover:border-gray-600'
        ]"
      >
        <h3 class="font-semibold mb-1.5 text-white">{{ prompt.title }}</h3>
        <p class="text-sm text-gray-400 line-clamp-2 mb-2">{{ prompt.content }}</p>
        <div v-if="prompt.tags" class="flex flex-wrap gap-1.5">
          <Tag 
            v-for="tag in parseTags(prompt.tags)" 
            :key="tag"
            :label="tag"
            @click="emit('filterByTag', tag)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>