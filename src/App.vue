<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePrompts } from './composables/usePrompts'
import { useToast } from './composables/useToast'
import { useKeyboard } from './composables/useKeyboard'
import Sidebar from './components/Sidebar.vue'
import PromptList from './components/PromptList.vue'
import PromptEditor from './components/PromptEditor.vue'
import VariableModal from './components/VariableModal.vue'
import ConfirmModal from './components/ConfirmModal.vue'
import Toast from './components/Toast.vue'

const {
  selectedFolder,
  selectedPrompt,
  searchQuery,
  folders,
  prompts,
  actualFolders,
  selectedTag,
  loadPrompts,
  selectFolder,
  selectPrompt,
  handleCreatePrompt,
  handleSave,
  handleFolderChange,
  handleDeletePrompt,
  handleExport,
  handleImport,
  filterByTag,
  clearTagFilter
} = usePrompts()

const { success, error } = useToast()

const showVariableModal = ref(false)
const modalContent = ref('')
const showDeleteConfirm = ref(false)
const promptListRef = ref<InstanceType<typeof PromptList> | null>(null)

// Keyboard shortcuts
useKeyboard({
  newPrompt: () => handleCreatePrompt(),
  save: () => handleSavePrompt(),
  focusSearch: () => promptListRef.value?.focusSearch(),
  copy: () => handleCopy(),
  escape: () => {
    if (showVariableModal.value) {
      closeVariableModal()
    } else if (showDeleteConfirm.value) {
      cancelDelete()
    }
  },
  export: () => handleExport()
})

onMounted(async () => {
  await loadPrompts()
})

function handleCopy() {
  if (selectedPrompt.value) {
    const regex = /\{\{([^}]+)\}\}/g
    const matches = selectedPrompt.value.content.matchAll(regex)
    const variables = [...new Set(Array.from(matches, (m: RegExpMatchArray) => m[1].trim()))]
    
    if (variables.length > 0) {
      modalContent.value = selectedPrompt.value.content
      showVariableModal.value = true
    } else {
      navigator.clipboard.writeText(selectedPrompt.value.content)
      success('Copied to clipboard!')
    }
  }
}

function handleVariableCopy(content: string) {
  navigator.clipboard.writeText(content)
  showVariableModal.value = false
  success('Copied with variables filled!')
}

function closeVariableModal() {
  showVariableModal.value = false
  modalContent.value = ''
}

async function handleImportFile(file: File) {
  try {
    const count = await handleImport(file)
    success(`Imported ${count} prompts successfully!`)
  } catch (err: any) {
    error('Error importing file: ' + err.message)
  }
}

async function handleSavePrompt() {
  await handleSave()
  success('Prompt saved!')
}

function confirmDelete() {
  showDeleteConfirm.value = true
}

async function handleConfirmDelete() {
  await handleDeletePrompt()
  showDeleteConfirm.value = false
  success('Prompt deleted!')
}

function cancelDelete() {
  showDeleteConfirm.value = false
}
</script>

<template>
  <div class="flex h-screen bg-gray-900 text-gray-100">
    <Sidebar 
      :folders="folders"
      :selected-folder="selectedFolder"
      @select-folder="selectFolder"
      @export="handleExport"
      @import="handleImportFile"
      @refresh-prompts="loadPrompts"
    />

    <PromptList 
      ref="promptListRef"
      :prompts="prompts"
      :selected-prompt="selectedPrompt"
      v-model:search-query="searchQuery"
      @select-prompt="selectPrompt"
      @create-prompt="handleCreatePrompt"
      @filter-by-tag="filterByTag"
    />

    <PromptEditor 
      :prompt="selectedPrompt"
      :folders="actualFolders"
      @save="handleSavePrompt"
      @delete="confirmDelete"
      @copy="handleCopy"
      @folder-change="handleFolderChange"
    />

    <VariableModal 
      :show="showVariableModal"
      :content="modalContent"
      @close="closeVariableModal"
      @copy="handleVariableCopy"
    />

    <ConfirmModal 
      :show="showDeleteConfirm"
      title="Delete Prompt"
      message="Are you sure you want to delete this prompt? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      :danger="true"
      @confirm="handleConfirmDelete"
      @cancel="cancelDelete"
    />

    <Toast />
  </div>
</template>