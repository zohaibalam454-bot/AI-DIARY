export type DiaryEntry = {
  id: string
  content: string
  iv: string
  salt: string
  createdAt: string
  updatedAt: string
}

export type DiaryItem = {
  id: string
  userId: string
  title: string
  entries: DiaryEntry[]
  createdAt: string
  updatedAt: string
}

const db: { diaries: DiaryItem[]; users: { id: string; name: string; email: string; passwordHash: string }[] } = {
  diaries: [],
  users: [],
}

export function createUser(user: { id: string; name: string; email: string; passwordHash: string }) {
  db.users.push(user)
  return user
}

export function findUserByEmail(email: string) {
  return db.users.find(u => u.email === email)
}

export function findUserById(id: string) {
  return db.users.find(u => u.id === id)
}

export function createDiary(d: Omit<DiaryItem, 'createdAt' | 'updatedAt'>) {
  const diary: DiaryItem = { ...d, entries: d.entries || [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  db.diaries.push(diary)
  return diary
}

export function updateDiary(id: string, userId: string, patch: Partial<DiaryItem>) {
  const idx = db.diaries.findIndex(d => d.id === id && d.userId === userId)
  if (idx === -1) return null
  db.diaries[idx] = { ...db.diaries[idx], ...patch, updatedAt: new Date().toISOString() }
  return db.diaries[idx]
}

export function addDiaryEntry(diaryId: string, userId: string, entry: Omit<DiaryEntry, 'createdAt' | 'updatedAt'>) {
  const d = db.diaries.find(dd => dd.id === diaryId && dd.userId === userId)
  if (!d) return null
  const newEntry: DiaryEntry = { ...entry, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  d.entries.push(newEntry)
  d.updatedAt = new Date().toISOString()
  return newEntry
}

export function updateDiaryEntry(diaryId: string, userId: string, entryId: string, patch: Partial<DiaryEntry>) {
  const d = db.diaries.find(dd => dd.id === diaryId && dd.userId === userId)
  if (!d) return null
  const idx = d.entries.findIndex(e => e.id === entryId)
  if (idx === -1) return null
  d.entries[idx] = { ...d.entries[idx], ...patch, updatedAt: new Date().toISOString() }
  d.updatedAt = new Date().toISOString()
  return d.entries[idx]
}

export function getDiariesForUser(userId: string) {
  return db.diaries.filter(d => d.userId === userId)
}

export function getDiary(userId: string, id: string) {
  return db.diaries.find(d => d.userId === userId && d.id === id) || null
}

export function deleteDiary(userId: string, id: string) {
  const oldLen = db.diaries.length
  db.diaries = db.diaries.filter(d => d.userId !== userId || d.id !== id)
  return db.diaries.length !== oldLen
}
