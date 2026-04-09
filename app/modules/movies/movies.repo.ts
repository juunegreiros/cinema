import { Movie, PrismaClient, Prisma } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] })
const prisma = new PrismaClient({ adapter })

export async function listMovies() {
  const movies = await prisma.movie.findMany()

  return movies
}

export async function createMovie(movie: Prisma.MovieCreateInput) {
  const movies = await prisma.movie.create({
    data: {
      title: movie.title,
      durationMinutes: movie.durationMinutes,
      ageRating: movie.ageRating,
      active: movie.active,
    },
  })

  return movies
}

export async function getMovieById(id: string) {
  const movie = await prisma.movie.findUnique({
    where: { id },
  })

  return movie
}

export async function updateMovie(id: string, movie: Partial<Movie>) {
  const updatedMovie = await prisma.movie.update({
    where: { id },
    data: movie,
  })

  return updatedMovie
}

export async function deleteMovie(id: string) {
  const deletedMovie = await prisma.movie.delete({
    where: { id },
  })

  return deletedMovie
}
