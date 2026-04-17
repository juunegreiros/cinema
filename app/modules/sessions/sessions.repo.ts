import { PrismaClient, Prisma } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] })
const prisma = new PrismaClient({ adapter })

export async function listUpcomingSessionsByMovie(movieId: string) {
  return await prisma.session.findMany({
    where: {
      movieId: movieId,
      start: { gte: new Date() }, // Apenas sessões futuras
    },
    include: {
      room: { select: { name: true, type: true } }, // Traz qual é a sala e o tipo (NORMAL, PRO_MAX, VIP)
    },
    orderBy: { start: 'asc' }, // Ordena por horário de início crescente
  })
}

export async function createSession(session: Prisma.SessionUncheckedCreateInput) {
  return await prisma.session.create({ data: session }) // A criação de sessão agora é feita diretamente com os dados necessários, e o Prisma cuidará da validação automática
}
