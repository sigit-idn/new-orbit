import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetAttachment = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetAttachment), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const attachment = await db.attachment.findFirst({ where: { id } })

  if (!attachment) throw new NotFoundError()

  return attachment
})
