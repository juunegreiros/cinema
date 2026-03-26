import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Iniciando seed...')

  const movie = await prisma.movie.create({
    data: {
      title: 'Hereditary',
      durationMinutes: 180,
      ageRating: 'R_16',
      active: true,
    },
  })

  const room = await prisma.room.create({
    data: {
      name: 'Room 1',
      type: 'PRO_MAX',
      active: true,
    },
  })

  await prisma.seat.create({
    data: {
      identifier: 'A1',
      roomId: room.id,
      active: true,
    },
  })

  const startTime = new Date()

  const trailerTime = 10
  const sessionDuration = movie.durationMinutes + trailerTime
  const endTime = new Date(startTime.getTime() + sessionDuration * 60000)

  await prisma.session.create({
    data: {
      movieId: movie.id,
      roomId: room.id,
      durationMinutes: sessionDuration,
      start: startTime,
      end: endTime,
    },
  })

  console.log('✅ Tudo criado com sucesso!')
}

main().finally(() => {
  prisma.$disconnect()
})
