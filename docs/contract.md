# Contrato - Cinema

## Filme (Movie)

_Campos:_

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

_Exemplo:_

{
"id": "e4b5b7c8-90f1-4b2a-a5b6-c7d8e9f0a1b2",
"title": "Hereditary",
"durationMinutes": 180,
"ageRating": "18",
"active": true
}

## Sala (Room)

_Campos:_

- **id:** Pk, UUID, obrigatório
- **name:** varchar unico, obrigatório
- **type:** enum (
- normal = Sala comum com numero x de seats
- pro_max = Sala com tela maior e numero de seats > normal
- vip = Sala com atendimento da bomboniere e numero de seats < normal
  )
- **active:** boolean

_Exemplo:_

{
"id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
"name": "Sala 04",
"type": "vip",
"active": true
}

## Assento (Seat)

_Campos:_

- **id:** Pk, UUID, obrigatório
- **identifier:** varchar, obrigatório, único apenas dentro da roomId
- **roomId:** Fk, UUID, obrigatório
- **active:** boolean

_Exemplo:_

{
"id": "f1e2d3c4-b5a6-7988-8799-0a1b2c3d4e5f",
"identifier": "A12",
"roomId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
"active": true
}

## Sessão (Session)

_Campos:_

- **id:** Pk, UUID, obrigatório
- **movieId:** Fk, UUID, obrigatório [
  - **title:** varchar, obrigatório
  - **active:** boolean (filme referenciado deve obrigatoriamente ter o campo "active: true")
    ]
- **roomId:** Fk, UUID, obrigatório [
  - **name:** varchar unico, obrigatório
  - **active:** boolean (sala referenciada deve obrigatoriamente ter o campo "active: true")
    ]
- **durationMinutes:** Fk, int
- **start:** datetime >= today, obrigatório
- **end:** datetime > start, obrigatório, calculado automaticamente (
  end = start + 10 minutos de trailer + durationMinutes
  )
- **createSession:** newSession.start >= previousSession.end + 5 minutos

  _Exemplo:_

{
"id": "1a2b3c4d-5e6f-7a8b-9c0d-e1f2a3b4c5d6",
"movieId": "e4b5b7c8-90f1-4b2a-a5b6-c7d8e9f0a1b2",
"roomId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
"durationMinutes": "180",
"start": "2026-03-05T20:00:00Z",
"end": "2026-03-05T23:10:00Z"

}

## Reserva (Booking)

Regras de Negócio:

• Não pode haver duas reservas ativas para o mesmo seat na mesma sessão.

_Campos:_

- **id:** Pk, UUID, obrigatório
- **userId:** Fk, UUID, obrigatório
- **sessionId:** Fk, UUID, obrigatório (now <= startSession + 30 minutos)
- **seatId:** Fk, UUID, obrigatório [
  - **roomId:** Fk, UUID, obrigatório (O assento referenciado deve pertencer à mesma "roomId" atrelada à "sessionId")
  - **active:** boolean (assento referenciado deve obrigatoriamente ter o campo "active: true")
    ]
- **status:** enum (
- pending = Reserva não finalizada
- confirmed = Reserva finalizada e confirmada
- cancelled = Reserva cancelada por n motivos
- used = Reserva já usada, não pode ser considerada valida mais
  ) (Validação de Atualização: Se o status atual salvo no banco for "cancelled" ou "used", qualquer requisição para alterar este campo deve ser bloqueada.)

_Exemplo:_

{
"id": "9f8e7d6c-5b4a-3210-fedc-ba0987654321",
"userId": "c3b2a1d0-e9f8-47a6-b5c4-d3e2f1a0b9c8",
"sessionId": "1a2b3c4d-5e6f-7a8b-9c0d-e1f2a3b4c5d6",
"seatId": "f1e2d3c4-b5a6-7988-8799-0a1b2c3d4e5f",
"status": "confirmed"
}

## Pedido VIP (VIPOrder)

_Regras de Negócio:_

• Usuário precisa ter reserva confirmed.
• Só pode ser feito para salas do tipo VIP.
• Só pode ser criado durante a janela de trailers.
• Deve ser enviado para API externa da bomboniere.
• Deve armazenar informações para auditoria

_Campos:_

- **id:** Pk, UUID, obrigatório
- **userId:** Fk, UUID, obrigatório
- **bookingId:** Fk, UUID, obrigatório [
  - **status:** enum (booking referenciado deve estar com "status: confirmed")
  - **userId:** Fk, UUID, obrigatório (userId do pedido deve ser o mesmo userId dono da reserva)
    ]
- **createdAt:** datetime, obrigatório (createdAt deve estar obrigatoriamente entre startSession e startSession + 10 minutos. Pedidos fora dessa janela são bloqueados.)
- **status:** enum (
- created = Pedido criado
- sent = Pedido enviado a bomboniere
- delivered = Pedido enviado para a sala
- cancelled = Pedido cancelado
  )
- **totalValue:** double

_Exemplo:_

{
"id": "5d4c3b2a-10f9-8e7d-6c5b-4a3210fedcba",
"userId": "c3b2a1d0-e9f8-47a6-b5c4-d3e2f1a0b9c8",
"bookingId": "9f8e7d6c-5b4a-3210-fedc-ba0987654321",
"createdAt:" "2026-03-05T20:05:00Z"
"status": "created",
"totalValue": 49.50
}

## Item do Cardápio (ProductItem)

_Campos:_

- **id:** Pk, UUID, obrigatório
- **name:** varchar, obrigatório
- **description:** varchar, opcional
- **currentPrice:** double >= 0, obrigatório
- **active:** boolean, obrigatório

_Exemplo:_

{
"id": "7a8b9c0d-1e2f-3a4b-5c6d-e7f8a9b0c1d2",
"name": "Pipoca Grande Salgada",
"description": "Balde de pipoca salgada com manteiga",
"currentPrice": 25.50,
"active": true
}

## Item Pedido (VIPOrderItem)

_Campos:_

- **id:** Pk, UUID, obrigatório
- **VIPOrder:** Fk, UUID, obrigatório
- **productItemId:** Fk, UUID, obrigatório (produto referenciado deve estar com "active: true")
- **unitPrice:** double >= 0
- **amount:** int > 0

_Exemplo:_

{
"id": "f8e7d6c5-b4a3-2109-8765-43210fedcba9",
"orderId": "5d4c3b2a-10f9-8e7d-6c5b-4a3210fedcba",
"productId": "7a8b9c0d-1e2f-3a4b-5c6d-e7f8a9b0c1d2",
"unitPrice": 25.50,
"amount": 1
}
