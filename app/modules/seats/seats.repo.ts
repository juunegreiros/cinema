import { Seat, PrismaClient, Prisma } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] })
const prisma = new PrismaClient({ adapter })

export async function listSeats() {
  const seats = await prisma.seat.findMany()

  return seats
}

export async function createSeat(seat: Prisma.SeatUncheckedCreateInput) {
  const createdSeat = await prisma.seat.create({
    data: {
      identifier: seat.identifier,
      roomId: seat.roomId,
      active: seat.active,
    },
  })

  return createdSeat
}

export async function getSeatById(id: string) {
  const seat = await prisma.seat.findUnique({
    where: { id },
  })

  return seat
}

export async function updateSeat(id: string, seat: Partial<Seat>) {
  const updatedSeat = await prisma.seat.update({
    where: { id },
    data: seat,
  })

  return updatedSeat
}

export async function deleteSeat(id: string) {
  const deletedSeat = await prisma.seat.delete({
    where: { id },
  })

  return deletedSeat
}
