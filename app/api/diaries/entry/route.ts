import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import authOptions from '../../../../lib/auth'
import { addDiaryEntry, updateDiaryEntry } from '../../../../lib/db'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) return NextResponse.json({ ok: false }, { status: 401 })
  const { diaryId, content, iv, salt } = await req.json()
  if (!diaryId || !content || !iv || !salt) return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 })
  const entry = addDiaryEntry(diaryId, session.user.id as string, { id: uuidv4(), content, iv, salt })
  if (!entry) return NextResponse.json({ ok: false, error: 'Diary not found' }, { status: 404 })
  return NextResponse.json({ ok: true, entry })
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) return NextResponse.json({ ok: false }, { status: 401 })
  const { diaryId, entryId, content, iv, salt } = await req.json()
  if (!diaryId || !entryId || !content || !iv || !salt) return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 })
  const entry = updateDiaryEntry(diaryId, session.user.id as string, entryId, { content, iv, salt })
  if (!entry) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true, entry })
}
