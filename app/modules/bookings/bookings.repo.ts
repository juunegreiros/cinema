import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] })
const prisma = new PrismaClient({ adapter })

export async function createBooking(data: { userId: string; sessionId: string; seatId: string }) {
  const existingBooking = await prisma.booking.findFirst({
    where: {
      sessionId: data.sessionId,
      seatId: data.seatId,
      status: { not: 'CANCELLED' }, // Se foi cancelado, a poltrona está livre
    },
  })

  if (existingBooking) {
    throw new Error('Seat is already booked for this session') // Lança um erro que será capturado no route.ts e retornará um 409 Conflict
  }

  const newBooking = await prisma.booking.create({
    data: {
      userId: data.userId,
      sessionId: data.sessionId,
      seatId: data.seatId,
      status: 'PENDING', // Começa sempre como pendente
    },
  })

  return newBooking
}

export async function listUserBookings(userId: string) {
  return await prisma.booking.findMany({
    where: { userId },
    include: {
      session: {
        include: { movie: true, room: true }, // Traz o combo completo para o ticket do cliente
      },
      seat: true,
    },
  })
}
