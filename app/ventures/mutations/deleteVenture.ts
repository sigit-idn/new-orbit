import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteVenture = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteVenture), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const venture = await db.venture.deleteMany({ where: { id } })

  return venture
})
