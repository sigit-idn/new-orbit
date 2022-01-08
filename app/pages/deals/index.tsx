import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getDeals from "app/deals/queries/getDeals"

const ITEMS_PER_PAGE = 100

export const DealsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ deals, hasMore }] = usePaginatedQuery(getDeals, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {deals.map((deal) => (
          <li key={deal.id}>
            <Link href={Routes.ShowDealPage({ dealId: deal.id })}>
              <a>{deal.title}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const DealsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Deals</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewDealPage()}>
            <a>Create Deal</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <DealsList />
        </Suspense>
      </div>
    </>
  )
}

DealsPage.authenticate = true
DealsPage.getLayout = (page) => <Layout>{page}</Layout>

export default DealsPage
