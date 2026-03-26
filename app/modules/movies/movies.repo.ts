import { Movie, PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { AgeRate } from '@/app/generated/prisma/enums'

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] })
const prisma = new PrismaClient({ adapter })

export async function listMovies() {
  const movies = await prisma.movie.findMany()

  return movies
}

export async function createMovie(movie: Movie) {
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
