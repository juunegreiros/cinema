import { NextResponse } from 'next/server'
import { MovieCreateRequest } from '@/contracts/movie/movie-create.request'
import { MovieResponse } from '@/contracts/movie/movie-response'

export async function POST(req: Request) {
  const body: MovieCreateRequest = await req.json()

  const movie: MovieResponse = {
    id: crypto.randomUUID(),
    title: body.title,
    durationMinutes: body.durationMinutes,
    rating: body.rating,
    active: body.active,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json(movie, { status: 201 })
}

export async function GET() {
  return NextResponse.json({ message: 'API de movies online 🚀' }, { status: 200 })
}
