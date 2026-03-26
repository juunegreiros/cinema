import { NextResponse } from 'next/server'
import { listMovies } from '@/app/modules/movies/movies.repo'

export async function GET() {
  const movies = await listMovies()

  return NextResponse.json({ data: movies }, { status: 200 })
}
