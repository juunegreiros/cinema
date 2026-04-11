import { NextResponse } from 'next/server'
import { deleteRoom, updateRoom, getRoomById } from '@/app/modules/rooms/rooms.repo'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: 'Room ID is Mandatory !' }, { status: 400 })
  }

  const room = await getRoomById(id)

  return NextResponse.json({ data: room }, { status: 200 })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params
  const body = await request.json()
  const updatedRoom = await updateRoom(id, body)

  return NextResponse.json({ data: updatedRoom }, { status: 200 })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params
  const deletedRoom = await deleteRoom(id)

  return NextResponse.json({ data: deletedRoom }, { status: 200 })
}
