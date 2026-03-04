# Contrato

## Filme (Movie)

Regras de Negócio:

• Apenas administradores podem criar ou editar.
• Usuários comuns podem visualizar apenas filmes ativos.

Campos:

• id: Pk, UUID, obrigatório
• title: varchar obrigatório
• durationMinutes: int > 0
• ageRating: enum (L, 10, 12, 14, 16, 18)
• active: boolean

Exemplo:
{
"id": "e4b5b7c8-90f1-4b2a-a5b6-c7d8e9f0a1b2",
"title": "Hereditary",
"durationMinutes": 180,
"ageRating": "18",
"active": true
}

## Sala (Room)

Regras de Negócio:

• Nome da sala deve ser único.
• Apenas administradores podem criar ou editar.

Campos:

• id: Pk, UUID, obrigatório
• name: Pk, varchar unico, obrigatório
• type: varchar (normal, pro_max, vip)
• active: boolean

Exemplo:
{
"id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
"name": "Sala 04",
"type": "vip",
"active": true
}

## Assento (Seat)

Regras de Negócio:

• Deve pertencer a uma sala existente.
• Identificador deve ser único dentro da sala.
• Apenas administradores podem criar ou editar.

Campos:

• id: Pk, UUID, obrigatório
• identifier: Pk, varchar unico, obrigatório
• roomId: Fk, UUID, obrigatório
• active: boolean

Exemplo:
{
"id": "f1e2d3c4-b5a6-7988-8799-0a1b2c3d4e5f",
"identifier": "A12",
"roomId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
"active": true
}

## Sessão (Session)

Regras de Negócio:

• Não pode haver sobreposição de sessões na mesma sala.
• Deve existir intervalo mínimo de 5 minutos entre sessões.
• Não pode criar sessão no passado.
• Não pode usar filme ou sala inativa.
• Apenas administradores e atendentes podem criar sessões.

Campos:

• id: Pk, UUID, obrigatório
• movieId: Fk, UUID, obrigatório
• roomId: Fk, UUID, obrigatório
• start: datetime, obrigatório
• end: datetime (calculado automaticamente), obrigatório

Exemplo:
{
"id": "1a2b3c4d-5e6f-7a8b-9c0d-e1f2a3b4c5d6",
"movieId": "e4b5b7c8-90f1-4b2a-a5b6-c7d8e9f0a1b2",
"roomId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
"start": "2026-03-05T20:00:00Z",
"end": "2026-03-05T23:00:00Z"
}

## Reserva (Booking)

Regras de Negócio:

• Seat deve pertencer à sala da sessão.
• Não pode haver duas reservas ativas para o mesmo seat na mesma sessão.
• Não pode criar reserva após 30 minutos do início da sessão.
• Não pode alterar status após cancelled ou used.
• Status confirmed indica pagamento realizado.

Campos:

• id: Pk, UUID, obrigatório
• userId: Pk, UUID, obrigatório
• sessionId: Fk, UUID, obrigatório
• seatId: Fk, UUID, obrigatório
• status: varchar (pending, confirmed, cancelled, used)

Exemplo:
{
"id": "9f8e7d6c-5b4a-3210-fedc-ba0987654321",
"userId": "c3b2a1d0-e9f8-47a6-b5c4-d3e2f1a0b9c8",
"sessionId": "1a2b3c4d-5e6f-7a8b-9c0d-e1f2a3b4c5d6",
"seatId": "f1e2d3c4-b5a6-7988-8799-0a1b2c3d4e5f",
"status": "confirmed"
}

## Pedido VIP (VIPOrder)

Regras de Negócio:

• Usuário precisa ter reserva confirmed.
• Só pode ser feito para salas do tipo VIP.
• Só pode ser criado durante a janela de trailers.
• Deve ser enviado para API externa da bomboniere.
• Deve armazenar informações para auditoria

Campos:

• id: Pk, UUID, obrigatório
• userId: Fk, UUID, obrigatório
• bookingId: Fk, UUID, obrigatório
• items: list [
{
"productId": Pk, UUID, obrigatório
"unitPrice": double
"amount": int
},
]
• status: varchar (created, sent, delivered, cancelled)
• totalValue: double

Exemplo:
{
"id": "5d4c3b2a-10f9-8e7d-6c5b-4a3210fedcba",
"userId": "c3b2a1d0-e9f8-47a6-b5c4-d3e2f1a0b9c8",
"bookingId": "9f8e7d6c-5b4a-3210-fedc-ba0987654321",
"items": [
{
"produtoId": "pipoca-grande",
"unitPrice": 25.50
"amount": 1,
},
{
"produtoId": "refrigerante-500ml",
"unitPrice": 12.00
"amount": 2,
}
],
"status": "created",
"totalValue": 49.50
}
