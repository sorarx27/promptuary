import { ref, computed } from 'vue'
import { 
  initDB, 
  getPrompts, 
  savePrompt, 
  createPrompt, 
  updatePromptFolder, 
  deletePrompt,
  getAllPromptsForExport,
  importPrompts
} from '../db'

export function usePrompts() {
  const selectedFolder = ref('All Prompts')
  const allPrompts = ref<any[]>([])
  const selectedPrompt = ref<any>(null)
  const searchQuery = ref('')
  const selectedTag = ref<string | null>(null)

  const folders = computed(() => {
    const uniqueFolders = new Set(allPrompts.value.map(p => p.folder))
    return ['All Prompts', ...Array.from(uniqueFolders).sort()]
  })

  const prompts = computed(() => {
    let filtered = allPrompts.value
    
    if (selectedFolder.value !== 'All Prompts') {
      filtered = filtered.filter(p => p.folder === selectedFolder.value)
    }
    
    if (selectedTag.value) {
      filtered = filtered.filter(p => {
        if (!p.tags) return false
        const tags = p.tags.split(',').map((t: string) => t.trim())
        return tags.includes(selectedTag.value)
      })
    }
    
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.content.toLowerCase().includes(query) ||
        (p.tags && p.tags.toLowerCase().includes(query))
      )
    }
    
    return filtered
  })

  const actualFolders = computed(() => {
    return folders.value.filter(f => f !== 'All Prompts')
  })

  async function loadPrompts() {
    await initDB()
    allPrompts.value = (await getPrompts()) as any[]
    if (allPrompts.value.length > 0 && !selectedPrompt.value) {
      selectedPrompt.value = allPrompts.value[0]
    }
  }

  function selectFolder(folder: string) {
    selectedFolder.value = folder
    selectedTag.value = null // Clear tag filter when changing folders
    if (prompts.value.length > 0) {
      selectedPrompt.value = prompts.value[0]
    } else {
      selectedPrompt.value = null
    }
  }

  function selectPrompt(prompt: any) {
    selectedPrompt.value = prompt
  }

  async function handleCreatePrompt() {
    const folder = selectedFolder.value === 'All Prompts' ? 'Uncategorized' : selectedFolder.value
    const newPrompt = await createPrompt('Untitled Prompt', '', folder)
    allPrompts.value = (await getPrompts()) as any[]
    selectedPrompt.value = newPrompt
  }

  async function handleSave() {
    if (selectedPrompt.value) {
      const tags = selectedPrompt.value.tags 
        ? selectedPrompt.value.tags.split(',').filter((t: string) => t.trim()) 
        : []
      await savePrompt(
        selectedPrompt.value.id, 
        selectedPrompt.value.title, 
        selectedPrompt.value.content,
        tags
      )
      allPrompts.value = (await getPrompts()) as any[]
    }
  }

  async function handleFolderChange(newFolder: string) {
    if (selectedPrompt.value) {
      await updatePromptFolder(selectedPrompt.value.id, newFolder)
      selectedPrompt.value.folder = newFolder
      allPrompts.value = (await getPrompts()) as any[]
    }
  }

  async function handleDeletePrompt() {
    if (selectedPrompt.value) {
      await deletePrompt(selectedPrompt.value.id)
      allPrompts.value = (await getPrompts()) as any[]
      selectedPrompt.value = allPrompts.value.length > 0 ? allPrompts.value[0] : null
    }
  }

  async function handleExport() {
    const data = await getAllPromptsForExport()
    const exportData = {
      version: '1.0',
      exported_at: new Date().toISOString(),
      prompts: data
    }
    
    const jsonString = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `promptuary-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    
    URL.revokeObjectURL(url)
  }

  async function handleImport(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async (event: any) => {
        try {
          const data = JSON.parse(event.target.result)
          
          if (data.prompts && Array.isArray(data.prompts)) {
            await importPrompts(data.prompts)
            allPrompts.value = (await getPrompts()) as any[]
            resolve(data.prompts.length)
          } else {
            reject(new Error('Invalid file format'))
          }
        } catch (error) {
          reject(error)
        }
      }
      reader.readAsText(file)
    })
  }

  function filterByTag(tag: string) {
    selectedTag.value = tag
  }

  function clearTagFilter() {
    selectedTag.value = null
  }

  return {
    // State
    selectedFolder,
    allPrompts,
    selectedPrompt,
    searchQuery,
    selectedTag,
    // Computed
    folders,
    prompts,
    actualFolders,
    // Methods
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
  }
}