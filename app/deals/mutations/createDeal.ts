import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateDeal = z.object({
  title: z.string(),
  description: z.string().optional(),
  isStarred: z.boolean().optional(),
  vehicle: z.string().optional(),
  roundsize: z.number().optional(),
  valuation: z.number().optional(),
  dealOwnerId: z.number().optional(),
  dealChampionId: z.number().optional(),
  ventureId: z.number(),
  status: z.any(),
  dueDate: z.date().optional(),
  userId: z.number().optional(),
})

export default resolver.pipe(resolver.zod(CreateDeal), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const deal = await db.deal.create({ data: input })

  return deal
})
