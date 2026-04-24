import { NextResponse } from 'next/server'
import { createVIPOrder } from '@/app/modules/VIPorders/VIPorders.repo'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, bookingId, items } = body
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'At least one item is required' }, { status: 400 })
    }

    const vipOrder = await createVIPOrder({ userId, bookingId, items })
    return NextResponse.json({ data: vipOrder }, { status: 201 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}
