import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateDeal = z.object({
  id: z.number(),
  name: z.string(),
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
