import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import authOptions from '../../../lib/auth'
import { createDiary, getDiariesForUser, getDiary, updateDiary } from '../../../lib/db'
import { v4 as uuidv4 } from 'uuid'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) return NextResponse.json({ ok: false }, { status: 401 })
  const userId = session.user.id as string
  const diaries = getDiariesForUser(userId)
  return NextResponse.json({ ok: true, diaries })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) return NextResponse.json({ ok: false }, { status: 401 })
  const body = await req.json()
  const { title } = body
  if (!title) return NextResponse.json({ ok: false, error: 'Missing title' }, { status: 400 })
  const diary = createDiary({ id: uuidv4(), userId: session.user.id as string, title, entries: [] })
  return NextResponse.json({ ok: true, diary })
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) return NextResponse.json({ ok: false }, { status: 401 })
  const body = await req.json()
  const { id, title } = body
  if (!id) return NextResponse.json({ ok: false, error: 'Missing id' }, { status: 400 })
  const result = updateDiary(id, session.user.id as string, { title })
  if (!result) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true, diary: result })
}
