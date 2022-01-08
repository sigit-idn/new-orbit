import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateVenture = z.object({
  title: z.string(),
  description: z.string(),
})

export default resolver.pipe(resolver.zod(CreateVenture), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const venture = await db.venture.create({ data: input })

  return venture
})
