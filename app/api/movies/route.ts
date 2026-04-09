import { NextResponse } from 'next/server'
import { listMovies, createMovie, updateMovie, deleteMovie, getMovieById } from '@/app/modules/movies/movies.repo'

export async function GET() {
  const movies = await listMovies()

  return NextResponse.json({ data: movies }, { status: 200 })
}

export async function GET_BY_ID(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'ID is Mandatory' }, { status: 400 })
  }

  const movie = await getMovieById(id)

  return NextResponse.json({ data: movie }, { status: 200 })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { title, durationMinutes, ageRating, active } = body
  const movie = await createMovie({ title, durationMinutes, ageRating, active })

  return NextResponse.json({ data: movie }, { status: 201 })
}

export async function UPDATE(request: Request) {
  const body = await request.json()
  const { id, title, durationMinutes, ageRating, active } = body
  const updatedMovie = await updateMovie(id, { title, durationMinutes, ageRating, active })

  return NextResponse.json({ data: updatedMovie }, { status: 200 })
}

export async function DELETE(request: Request) {
  const body = await request.json()
  const { id } = body
  const deletedMovie = await deleteMovie(id)

  return NextResponse.json({ data: deletedMovie }, { status: 200 })
}
