import { NextResponse } from 'next/server'
import { listRooms, createRoom } from '@/app/modules/rooms/rooms.repo'

export async function GET() {
  const rooms = await listRooms()

  return NextResponse.json({ data: rooms }, { status: 200 })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { name, type, active } = body
  const room = await createRoom({ name, type, active })

  return NextResponse.json({ data: room }, { status: 201 })
}
