import { Room, PrismaClient, Prisma } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

export async function listRooms() {
  const rooms = await prisma.room.findMany()

  return rooms
}

export async function createRoom(room: Prisma.RoomCreateInput) {
  const createdRoom = await prisma.room.create({
    data: {
      name: room.name,
      type: room.type,
      active: room.active,
    },
  })

  return createdRoom
}

export async function getRoomById(id: string) {
  const room = await prisma.room.findUnique({
    where: { id },
  })

  return room
}

export async function updateRoom(id: string, room: Partial<Room>) {
  const updatedRoom = await prisma.room.update({
    where: { id },
    data: room,
  })

  return updatedRoom
}

export async function deleteRoom(id: string) {
  const deletedRoom = await prisma.room.delete({
    where: { id },
  })

  return deletedRoom
}
