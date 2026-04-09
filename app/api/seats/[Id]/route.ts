import { NextResponse } from 'next/server'
import { listSeats, createSeat, deleteSeat, updateSeat, getSeatById } from '@/app/modules/seats/seats.repo'

export async function GET() {
  const seats = await listSeats()

  return NextResponse.json({ data: seats }, { status: 200 })
}

export async function GET_BY_ID(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'ID is Mandatory' }, { status: 400 })
  }
  const seat = await getSeatById(id)

  return NextResponse.json({ data: seat }, { status: 200 })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { identifier, roomId, active } = body
  const seat = await createSeat({ identifier, roomId, active })

  return NextResponse.json({ data: seat }, { status: 201 })
}

export async function UPDATE(request: Request) {
  const body = await request.json()
  const { id, identifier, roomId, active } = body
  const updatedSeat = await updateSeat(id, { identifier, roomId, active })

  return NextResponse.json({ data: updatedSeat }, { status: 200 })
}

export async function DELETE(request: Request) {
  const body = await request.json()
  const { id } = body
  const deletedSeat = await deleteSeat(id)

  return NextResponse.json({ data: deletedSeat }, { status: 200 })
}
