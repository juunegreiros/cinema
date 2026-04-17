import { NextResponse } from 'next/server'
import { listSeats, createSeat } from '@/app/modules/seats/seats.repo'

export async function GET() {
  const seats = await listSeats()

  return NextResponse.json({ data: seats }, { status: 200 })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { identifier, roomId, active } = body
  const seat = await createSeat({ identifier, roomId, active })

  return NextResponse.json({ data: seat }, { status: 201 })
}
