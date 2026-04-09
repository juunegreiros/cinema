import { NextResponse } from 'next/server'
import { deleteSeat, updateSeat, getSeatById } from '@/app/modules/seats/seats.repo'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: 'ID is Mandatory' }, { status: 400 })
  }
  const seat = await getSeatById(id)

  return NextResponse.json({ data: seat }, { status: 200 })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params
  const body = await request.json()
  const updatedSeat = await updateSeat(id, body)

  return NextResponse.json({ data: updatedSeat }, { status: 200 })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params
  const deletedSeat = await deleteSeat(id)

  return NextResponse.json({ data: deletedSeat }, { status: 201 })
}
