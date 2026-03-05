# Contrato - Cinema

## Filme (Movie)

Campos:

- **id:** Pk, UUID, obrigatório
- **title:** varchar, obrigatório
- **durationMinutes:** int > 0
- **ageRating:** enum (
  - L = livre
  - 10 = Acima de 10 anos
  - 12 = Acima de 12 anos
  - 14 = Acima de 14 anos
  - 16 = Acima de 16 anos
  - 18 = Acima de 18 anos
    )
- **active:** boolean

Exemplo:

{
"id": "e4b5b7c8-90f1-4b2a-a5b6-c7d8e9f0a1b2",
"title": "Hereditary",
"durationMinutes": 180,
"ageRating": "18",
"active": true
}

## Sala (Room)

Campos:

- **id:** Pk, UUID, obrigatório
- **name:** varchar unico, obrigatório
- **type:** enum (
- normal = Sala comum com numero x de seats
- pro_max = Sala com tela maior e numero de seats > normal
- vip = Sala com atendimento da bomboniere e numero de seats < normal
  )
- **active:** boolean

Exemplo:

{
"id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
"name": "Sala 04",
"type": "vip",
"active": true
}

## Assento (Seat)

Campos:

- **id:** Pk, UUID, obrigatório
- **identifier:** varchar, obrigatório, único apenas dentro da roomId
- **bookingId:** Fk, UUID, obrigatório
- **roomId:** Fk, UUID, obrigatório
- **active:** boolean

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

Campos:

- **id:** Pk, UUID, obrigatório
- **movieId:** Fk, UUID, obrigatório
- **roomId:** Fk, UUID, obrigatório
- **durationMinutes:** Fk, int > 0
- **start:** datetime >= today, obrigatório
- **end:** datetime > start, obrigatório, calculado automaticamente (end = start + periodo de trailers + durationMinutes)

Exemplo:

{
"id": "1a2b3c4d-5e6f-7a8b-9c0d-e1f2a3b4c5d6",
"movieId": "e4b5b7c8-90f1-4b2a-a5b6-c7d8e9f0a1b2",
"roomId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
"durationMinutes": "180",
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

- **id:** Pk, UUID, obrigatório
- **userId:** Fk, UUID, obrigatório
- **sessionId:** Fk, UUID, obrigatório
- **seatId:** Fk, UUID, obrigatório
- **status:** enum (
- pending = Reserva não finalizada
- confirmed = Reserva finalizada e confirmada
- cancelled = Reserva cancelada por n motivos
- used = Reserva já usada, não pode ser considerada valida mais
  )

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

- **id:** Pk, UUID, obrigatório
- **userId:** Fk, UUID, obrigatório
- **bookingId:** Fk, UUID, obrigatório
- **createdAt:** datetime, obrigatório
- **items:** list [
  {
- "productId": Pk, UUID, obrigatório
- "unitPrice": double
- "amount": int
  },
  ]
- **status:** enum (
- created = Pedido criado
- sent = Pedido enviado a bomboniere
- delivered = Pedido enviado para a sala
- cancelled = Pedido cancelado
  )
- **totalValue:** double

Exemplo:

{
"id": "5d4c3b2a-10f9-8e7d-6c5b-4a3210fedcba",
"userId": "c3b2a1d0-e9f8-47a6-b5c4-d3e2f1a0b9c8",
"bookingId": "9f8e7d6c-5b4a-3210-fedc-ba0987654321",
"items": [
{
"productId": "pipoca-grande",
"unitPrice": 25.50
"amount": 1,
},
{
"productId": "refrigerante-500ml",
"unitPrice": 12.00
"amount": 2,
}
],
"status": "created",
"totalValue": 49.50
}
