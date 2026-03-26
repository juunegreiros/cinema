import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { AgeRate } from '@/app/generated/prisma/enums'

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] })
const prisma = new PrismaClient({ adapter })

export async function listMovies() {
  const movies = await prisma.movie.findMany()

  return movies
}

export async function createMovie(movies: {
  title: string
  durationMinutes: number
  ageRating: AgeRate
  active: boolean
}) {
  const createdMovie = await prisma.movie.create({
    data: {
      title: movies.title,
      durationMinutes: movies.durationMinutes,
      ageRating: movies.ageRating,
      active: movies.active,
    },
  })

  return createdMovie
}
