import { NextResponse } from 'next/server'
import { listMovies, createMovie } from '@/app/modules/movies/movies.repo'

export async function GET() {
  const movies = await listMovies()

  return NextResponse.json({ data: movies }, { status: 200 })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { title, durationMinutes, ageRating, active } = body
  const movie = await createMovie({ title, durationMinutes, ageRating, active })

  return NextResponse.json({ data: movie }, { status: 201 })
}
