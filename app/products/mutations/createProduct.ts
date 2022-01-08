import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateProduct = z.object({
  title: z.string(),
  description: z.string().nullable(),
  ventureId: z.number(),
})

export default resolver.pipe(resolver.zod(CreateProduct), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const product = await db.product.create({ data: input })

  return product
})
