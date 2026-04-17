import { NextResponse } from 'next/server'
import { createBooking, listUserBookings } from '@/app/modules/bookings/bookings.repo'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, sessionId, seatId } = body
    const booking = await createBooking({ userId, sessionId, seatId })
    return NextResponse.json({ data: booking }, { status: 201 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 409 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'O parâmetro userId é obrigatório.' }, { status: 400 })
  }
  const bookings = await listUserBookings(userId)
  return NextResponse.json({ data: bookings }, { status: 200 })
}
