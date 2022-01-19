import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateAttachment = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateAttachment),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const attachment = await db.attachment.update({ where: { id }, data })

    return attachment
  }
)
