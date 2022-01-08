import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateVenture = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateVenture),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const venture = await db.venture.update({ where: { id }, data })

    return venture
  }
)
