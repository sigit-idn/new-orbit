import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getVenture from "app/ventures/queries/getVenture"
import deleteVenture from "app/ventures/mutations/deleteVenture"

export const Venture = () => {
  const router = useRouter()
  const ventureId = useParam("ventureId", "number")
  const [deleteVentureMutation] = useMutation(deleteVenture)
  const [venture] = useQuery(getVenture, { id: ventureId })

  return (
    <>
      <Head>
        <title>Venture {venture.id}</title>
      </Head>

      <div>
        <h1>Venture {venture.id}</h1>
        <pre>{JSON.stringify(venture, null, 2)}</pre>

        <Link href={Routes.EditVenturePage({ ventureId: venture.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteVentureMutation({ id: venture.id })
              router.push(Routes.VenturesPage())
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

const ShowVenturePage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.VenturesPage()}>
          <a>Ventures</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Venture />
      </Suspense>
    </div>
  )
}

ShowVenturePage.authenticate = true
ShowVenturePage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowVenturePage
