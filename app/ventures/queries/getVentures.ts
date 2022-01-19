import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetVenturesInput
  extends Pick<Prisma.VentureFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetVenturesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: ventures,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.venture.count({ where }),
      query: (paginateArgs) => db.venture.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      ventures,
      nextPage,
      hasMore,
      count,
    }
  }
)
