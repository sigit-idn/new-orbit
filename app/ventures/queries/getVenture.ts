import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetVenture = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetVenture), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const venture = await db.venture.findFirst({ where: { id } })

  if (!venture) throw new NotFoundError()

  return venture
})
