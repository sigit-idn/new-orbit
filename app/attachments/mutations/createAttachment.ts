import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateAttachment = z.object({
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(CreateAttachment),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const attachment = await db.attachment.create({ data: input })

    return attachment
  }
)
