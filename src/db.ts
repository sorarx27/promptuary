import Database from '@tauri-apps/plugin-sql'


let db: Database | null = null


export async function initDB() {
  if (!db) {
    // Use the correct connection string for Tauri v2
    db = await Database.load('sqlite:promptuary.db')
    
    // Create prompts table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS prompts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        folder TEXT DEFAULT 'All Prompts',
        tags TEXT,
        variables TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Insert sample data if table is empty
    const count: any = await db.select('SELECT COUNT(*) as count FROM prompts')
    if (count[0].count === 0) {
      await db.execute(
        'INSERT INTO prompts (title, content, folder) VALUES (?, ?, ?)',
        ['Customer Support Email', 'You are a helpful customer support agent...', 'Work']
      )
      await db.execute(
        'INSERT INTO prompts (title, content, folder) VALUES (?, ?, ?)',
        ['Code Review Helper', 'Review the following code for...', 'Development']
      )
      await db.execute(
        'INSERT INTO prompts (title, content, folder) VALUES (?, ?, ?)',
        ['Blog Post Outline', 'Create an outline for a blog post about...', 'Writing']
      )
    }
  }
  return db
}


export async function getPrompts() {
  const database = await initDB()
  return await database.select('SELECT * FROM prompts ORDER BY updated_at DESC')
}


export async function savePrompt(id: number, title: string, content: string, tags?: string[]) {
  const database = await initDB()
  const tagsString = tags ? tags.join(',') : null
  return await database.execute(
    'UPDATE prompts SET title = ?, content = ?, tags = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [title, content, tagsString, id]
  )
}


export async function createPrompt(title: string, content: string, folder: string, tags?: string[]) {
  const database = await initDB()
  const tagsString = tags ? tags.join(',') : null
  await database.execute(
    'INSERT INTO prompts (title, content, folder, tags) VALUES (?, ?, ?, ?)',
    [title, content, folder, tagsString]
  )
  const prompts: any = await database.select('SELECT * FROM prompts WHERE id = last_insert_rowid()')
  return prompts[0]
}


export async function updatePromptFolder(id: number, folder: string) {
  const database = await initDB()
  return await database.execute(
    'UPDATE prompts SET folder = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [folder, id]
  )
}


export async function deletePrompt(id: number) {
  const database = await initDB()
  return await database.execute('DELETE FROM prompts WHERE id = ?', [id])
}


export async function getAllPromptsForExport() {
  const database = await initDB()
  return await database.select('SELECT * FROM prompts ORDER BY folder, title')
}


export async function importPrompts(prompts: any[]) {
  const database = await initDB()
  for (const prompt of prompts) {
    await database.execute(
      'INSERT INTO prompts (title, content, folder, tags, variables, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [
        prompt.title,
        prompt.content,
        prompt.folder || 'Imported',
        prompt.tags || null,
        prompt.variables || null,
        prompt.created_at || new Date().toISOString()
      ]
    )
  }
}


export async function clearAllPrompts() {
  const database = await initDB()
  await database.execute('DELETE FROM prompts')
}


export function parseTags(tagsString: string | null): string[] {
  if (!tagsString) return []
  return tagsString.split(',').filter(t => t.trim()).map(t => t.trim())
}