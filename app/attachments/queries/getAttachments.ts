import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetAttachmentsInput
  extends Pick<Prisma.AttachmentFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetAttachmentsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: attachments,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.attachment.count({ where }),
      query: (paginateArgs) => db.attachment.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      attachments,
      nextPage,
      hasMore,
      count,
    }
  }
)
