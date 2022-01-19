import { DealStatus } from "@prisma/client"
import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateDeal = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  vehicle: z.string().nullable(),
  isStarred: z.boolean(),
  roundsize: z.number().nullable(),
  valuation: z.number().nullable(),
  dealOwnerId: z.number().nullable(),
  dealChampionId: z.number().nullable(),
  ventureId: z.number(),
  status: z.any(),
  dueDate: z.date().nullable(),
  userId: z.number().nullable(),
})

export default resolver.pipe(
  resolver.zod(UpdateDeal),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const deal = await db.deal.update({ where: { id }, data })

    return deal
  }
)
