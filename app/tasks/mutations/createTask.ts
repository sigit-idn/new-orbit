import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateTask = z.object({
  title: z.string(),
  description: z.string().nullable(),
  userId: z.number().nullable(),
  status: z.any(),
  dueDate: z.date(),
  dealId: z.number(),
})

export default resolver.pipe(resolver.zod(CreateTask), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const task = await db.task.create({ data: input })

  return task
})
