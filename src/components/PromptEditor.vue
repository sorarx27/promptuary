<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { CopyIcon, SaveIcon, TrashIcon, TagIcon } from 'lucide-vue-next'
import Tag from './Tag.vue'
import { parseTags } from '../db'

const props = defineProps<{
  prompt: any | null
  folders: string[]
}>()

const emit = defineEmits<{
  save: []
  delete: []
  copy: []
  folderChange: [folder: string]
}>()

const newTag = ref('')
const tags = ref<string[]>([])

watch(() => props.prompt, (newPrompt) => {
  if (newPrompt) {
    tags.value = parseTags(newPrompt.tags)
  } else {
    tags.value = []
  }
}, { immediate: true })

function addTag() {
  const tag = newTag.value.trim().toLowerCase()
  if (tag && !tags.value.includes(tag)) {
    tags.value.push(tag)
    if (props.prompt) {
      props.prompt.tags = tags.value.join(',')
    }
    newTag.value = ''
  }
}

function removeTag(tag: string) {
  tags.value = tags.value.filter(t => t !== tag)
  if (props.prompt) {
    props.prompt.tags = tags.value.join(',')
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    addTag()
  }
}
</script>

<template>
  <div class="flex-1 bg-gray-900 flex flex-col">
    <template v-if="prompt">
      <!-- Header with actions -->
      <div class="border-b border-gray-800 p-6 pb-4">
        <input 
          v-model="prompt.title"
          class="text-3xl font-bold mb-4 bg-transparent border-none w-full focus:outline-none text-white placeholder-gray-600"
          placeholder="Untitled prompt..."
        />
        
        <div class="flex items-center gap-3">
          <select 
            :value="prompt.folder"
            @change="emit('folderChange', ($event.target as HTMLSelectElement).value)"
            class="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 focus:border-blue-500"
          >
            <option v-for="folder in folders" :key="folder" :value="folder">
              📁 {{ folder }}
            </option>
          </select>
          
          <div class="flex-1"></div>
          
          <button 
            @click="emit('copy')" 
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm flex items-center gap-2 shadow-lg shadow-blue-600/20"
            title="Copy (Ctrl+K)"
          >
            <CopyIcon :size="16" />
            Copy
          </button>
          <button 
            @click="emit('save')" 
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium text-sm flex items-center gap-2"
            title="Save (Ctrl+S)"
          >
            <SaveIcon :size="16" />
            Save
          </button>
          <button 
            @click="emit('delete')" 
            class="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-lg font-medium text-sm flex items-center gap-2 border border-red-600/20"
          >
            <TrashIcon :size="16" />
            Delete
          </button>
        </div>
      </div>

      <!-- Tags Section -->
      <div class="px-6 py-4 border-b border-gray-800">
        <div class="flex items-center gap-2 mb-2">
          <TagIcon :size="16" class="text-gray-500" />
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tags</span>
        </div>
        <div class="flex flex-wrap gap-2 mb-3">
          <Tag 
            v-for="tag in tags" 
            :key="tag"
            :label="tag"
            :removable="true"
            @remove="removeTag(tag)"
          />
          <span v-if="tags.length === 0" class="text-sm text-gray-600 italic">No tags yet</span>
        </div>
        <div class="relative">
          <input 
            v-model="newTag"
            @keydown="handleKeyDown"
            type="text"
            placeholder="Add a tag and press Enter..."
            class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:border-blue-500 placeholder-gray-600"
          />
        </div>
      </div>

      <!-- Content Editor -->
      <div class="flex-1 p-6 flex flex-col">
        <textarea 
          v-model="prompt.content"
          class="flex-1 bg-gray-800/50 border border-gray-700 p-4 rounded-lg text-white resize-none focus:border-blue-500 font-mono text-sm leading-relaxed"
          placeholder="Enter your prompt here...

Use {{variables}} for dynamic content that can be filled before copying."
        />
      </div>
    </template>
    
    <!-- Empty State -->
    <div v-else class="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
      <div class="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
        <svg class="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-400 mb-2">No prompt selected</h3>
      <p class="text-sm text-center max-w-sm">Select a prompt from the list or create a new one to get started</p>
    </div>
  </div>
</template>