import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] })
const prisma = new PrismaClient({ adapter })

type VIPOrderPayload = {
  userId: string
  bookingId: string
  items: Array<{ itemId: string; amount: number }>
}

export async function createVIPOrder(data: VIPOrderPayload) {
  return await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: data.bookingId },
    })
    if (!booking || booking.userId !== data.userId) {
      throw new Error('Invalid booking or unauthorized user')
    }

    let totalValue = 0
    const orderItemsData = []

    for (const orderItem of data.items) {
      const item = await tx.item.findUnique({
        where: { id: orderItem.itemId },
      })
      if (!item || !item.active) {
        throw new Error(`Item ${orderItem.itemId} is invalid or inactive`)
      }

      const itemTotal = Number(item.currentPrice) * orderItem.amount
      totalValue += itemTotal

      orderItemsData.push({
        itemId: item.id,
        unitPrice: item.currentPrice,
        amount: orderItem.amount,
      })
    }

    const newVipOrder = await tx.vIPOrder.create({
      data: {
        userId: data.userId,
        bookingId: data.bookingId,
        status: 'CREATED',
        totalValue: totalValue,
        orderitems: {
          create: orderItemsData,
        },
      },
      include: {
        orderitems: true, // Retorna os itens criados para confirmação
      },
    })

    return newVipOrder
  })
}
