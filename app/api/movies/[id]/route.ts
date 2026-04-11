import { NextResponse } from 'next/server'
import { deleteMovie, getMovieById, updateMovie } from '@/app/modules/movies/movies.repo'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params
  const movie = await getMovieById(id)

  return NextResponse.json({ data: movie }, { status: 200 })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params
  const body = await request.json()
  const updatedMovie = await updateMovie(id, body)

  return NextResponse.json({ data: updatedMovie }, { status: 200 })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params
  const deletedMovie = await deleteMovie(id)

  return NextResponse.json({ data: deletedMovie }, { status: 201 })
}
