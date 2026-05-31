<script setup lang="ts">
import { ref } from 'vue'
import { createPrompt } from '../db'
import { FolderIcon, PlusIcon, SettingsIcon, DownloadIcon, UploadIcon } from 'lucide-vue-next'

const props = defineProps<{
  folders: string[]
  selectedFolder: string
}>()

const emit = defineEmits<{
  selectFolder: [folder: string]
  export: []
  import: [file: File]
  refreshPrompts: []
}>()

const showNewFolderInput = ref(false)
const newFolderName = ref('')
const showExportImportMenu = ref(false)

function handleAddFolder() {
  showNewFolderInput.value = true
}

async function createNewFolder() {
  if (newFolderName.value.trim()) {
    await createPrompt('Untitled Prompt', '', newFolderName.value.trim())
    emit('refreshPrompts')
    newFolderName.value = ''
    showNewFolderInput.value = false
  }
}

function cancelNewFolder() {
  newFolderName.value = ''
  showNewFolderInput.value = false
}

function toggleExportImportMenu() {
  showExportImportMenu.value = !showExportImportMenu.value
}

function handleExport() {
  emit('export')
  showExportImportMenu.value = false
}

function handleImportClick() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = async (e: any) => {
    const file = e.target.files[0]
    if (file) {
      emit('import', file)
      showExportImportMenu.value = false
    }
  }
  input.click()
}
</script>

<template>
  <div class="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Promptuary
        </h1>
        <div class="flex gap-1">
          <div class="relative">
            <button 
              @click="toggleExportImportMenu"
              class="p-2 hover:bg-gray-800 rounded-lg transition"
              title="Settings"
            >
              <SettingsIcon :size="18" class="text-gray-400" />
            </button>
            <div 
              v-if="showExportImportMenu"
              class="absolute right-0 mt-1 bg-gray-800 rounded-lg shadow-xl py-1 w-40 z-10 border border-gray-700"
            >
              <button 
                @click="handleExport"
                class="w-full text-left px-3 py-2 hover:bg-gray-700 text-sm flex items-center gap-2"
              >
                <DownloadIcon :size="16" />
                Export
              </button>
              <button 
                @click="handleImportClick"
                class="w-full text-left px-3 py-2 hover:bg-gray-700 text-sm flex items-center gap-2"
              >
                <UploadIcon :size="16" />
                Import
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Collections -->
    <div class="flex-1 overflow-y-auto">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Collections</h2>
        <button 
          @click="handleAddFolder"
          class="p-1 hover:bg-gray-800 rounded transition"
          title="New Folder"
        >
          <PlusIcon :size="16" class="text-gray-400" />
        </button>
      </div>
      
      <div v-if="showNewFolderInput" class="mb-3 animate-fadeIn">
        <input 
          v-model="newFolderName"
          @keyup.enter="createNewFolder"
          @keyup.esc="cancelNewFolder"
          class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:border-blue-500"
          placeholder="Folder name..."
          autofocus
        />
        <div class="flex gap-2 mt-2">
          <button 
            @click="createNewFolder" 
            class="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-medium"
          >
            Add
          </button>
          <button 
            @click="cancelNewFolder" 
            class="flex-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
      
      <ul class="space-y-1">
        <li 
          v-for="folder in folders" 
          :key="folder"
          @click="emit('selectFolder', folder)"
          :class="[
            'px-3 py-2 rounded-lg cursor-pointer flex items-center gap-2 group',
            selectedFolder === folder 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
              : 'hover:bg-gray-800 text-gray-300'
          ]"
        >
          <FolderIcon :size="16" :class="selectedFolder === folder ? 'text-white' : 'text-gray-500'" />
          <span class="text-sm font-medium">{{ folder }}</span>
        </li>
      </ul>
    </div>
  </div>

  <!-- Click outside to close menu -->
  <div 
    v-if="showExportImportMenu" 
    @click="showExportImportMenu = false"
    class="fixed inset-0 z-0"
  ></div>
</template>