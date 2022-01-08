import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateProduct = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  ventureId: z.number(),
})

export default resolver.pipe(
  resolver.zod(UpdateProduct),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const product = await db.product.update({ where: { id }, data })

    return product
  }
)
