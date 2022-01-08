import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getDeal from "app/deals/queries/getDeal"
import deleteDeal from "app/deals/mutations/deleteDeal"

export const Deal = () => {
  const router = useRouter()
  const dealId = useParam("dealId", "number")
  const [deleteDealMutation] = useMutation(deleteDeal)
  const [deal] = useQuery(getDeal, { id: dealId })

  return (
    <>
      <Head>
        <title>Deal {deal.id}</title>
      </Head>

      <div>
        <h1>Deal {deal.id}</h1>
        <pre>{JSON.stringify(deal, null, 2)}</pre>

        <Link href={Routes.EditDealPage({ dealId: deal.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteDealMutation({ id: deal.id })
              router.push(Routes.DealsPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowDealPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.DealsPage()}>
          <a>Deals</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Deal />
      </Suspense>
    </div>
  )
}

ShowDealPage.authenticate = true
ShowDealPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowDealPage
