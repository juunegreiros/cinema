import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params

  return NextResponse.json({ data: { id } }, { status: 200 })
}
