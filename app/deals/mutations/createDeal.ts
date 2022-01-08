import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateDeal = z.object({
  title: z.string(),
  description: z.string().nullable(),
  vehicle: z.string().nullable(),
  roundsize: z.number().nullable(),
  valuation: z.number().nullable(),
  dealOwnerId: z.number().nullable(),
  dealChampionId: z.number().nullable(),
  ventureId: z.number(),
  status: z.any(),
  dueDate: z.date().nullable(),
  userId: z.number().nullable(),
})

export default resolver.pipe(resolver.zod(CreateDeal), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const deal = await db.deal.create({ data: input })

  return deal
})
