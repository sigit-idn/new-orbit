import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteAttachment = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteAttachment),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const attachment = await db.attachment.deleteMany({ where: { id } })

    return attachment
  }
)
