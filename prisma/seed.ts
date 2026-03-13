import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] })
const prisma = new PrismaClient({ adapter })

async function createMovie() {
  await prisma.movie.create({
    data: {
      title: 'Hereditary',
      durationMinutes: 180,
      ageRating: 'R_16',
      active: true,
      createdAt: new Date(),
    },
  })
}

async function main() {
  await createMovie()
}

main().finally(() => {
  prisma.$disconnect()
})
