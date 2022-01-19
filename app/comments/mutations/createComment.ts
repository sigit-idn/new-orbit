import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateComment = z.object({
  content: z.string().nullable(),
  dealId: z.number().nullable(),
  userId: z.number().nullable(),
})

export default resolver.pipe(resolver.zod(CreateComment), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const comment = await db.comment.create({ data: input })

  return comment
})
