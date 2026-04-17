import { NextResponse } from 'next/server'
import { listUpcomingSessionsByMovie, createSession } from '@/app/modules/sessions/sessions.repo'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url) // A função de listagem agora traz as sessões futuras para o filme específico, incluindo dados da sala
  const movieId = searchParams.get('movieId')

  if (!movieId) {
    return NextResponse.json({ error: 'movieId is required for listing sessions' }, { status: 400 }) // Validação simples para garantir que o movieId seja fornecido
  }

  const sessions = await listUpcomingSessionsByMovie(movieId) // A função de listagem agora traz as sessões futuras para o filme específico, incluindo dados da sala
  return NextResponse.json({ data: sessions }, { status: 200 })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { movieId, roomId, durationMinutes, start, end } = body

  const session = await createSession({ movieId, roomId, durationMinutes, start, end }) // A função de criação de sessão recebe os dados necessários e retorna a sessão criada, com validação automática do Prisma
  return NextResponse.json({ data: session }, { status: 201 })
}
