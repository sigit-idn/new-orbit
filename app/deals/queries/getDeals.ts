import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetDealsInput
  extends Pick<Prisma.DealFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetDealsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant

    const {
      items: deals,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.deal.count({ where }),
      query: (paginateArgs) =>
        db.deal.findMany({
          ...paginateArgs,
          where,
          orderBy,
          include: { user: true, dealOwner: true },
        }),
    })

    return {
      deals,
      nextPage,
      hasMore,
      count,
    }
  }
)
