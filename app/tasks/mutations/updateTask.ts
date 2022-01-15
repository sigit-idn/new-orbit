import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateTask = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  userId: z.number().nullable(),
  status: z.any(),
  dueDate: z.date().nullable(),
  dealId: z.number().nullable(),
})

export default resolver.pipe(
  resolver.zod(UpdateTask),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const task = await db.task.update({ where: { id }, data })

    return task
  }
)
