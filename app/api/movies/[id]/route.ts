import { NextResponse } from 'next/server'
import { getMovieById } from '@/app/modules/movies/movies.repo'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params
  const movie = await getMovieById(id)

  return NextResponse.json({ data: movie }, { status: 200 })
}
