import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getVentures from "app/ventures/queries/getVentures"

const ITEMS_PER_PAGE = 100

export const VenturesList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ ventures, hasMore }] = usePaginatedQuery(getVentures, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {ventures.map((venture) => (
          <li key={venture.id}>
            <Link href={Routes.ShowVenturePage({ ventureId: venture.id })}>
              <a>{venture.title}</a>
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

const VenturesPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Ventures</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewVenturePage()}>
            <a>Create Venture</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <VenturesList />
        </Suspense>
      </div>
    </>
  )
}

VenturesPage.authenticate = true
VenturesPage.getLayout = (page) => <Layout>{page}</Layout>

export default VenturesPage
