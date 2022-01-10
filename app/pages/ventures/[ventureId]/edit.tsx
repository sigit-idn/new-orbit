import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getVenture from "app/ventures/queries/getVenture"
import updateVenture from "app/ventures/mutations/updateVenture"
import { VentureForm, FORM_ERROR } from "app/ventures/components/VentureForm"

export const EditVenture = () => {
  const router = useRouter()
  const ventureId = useParam("ventureId", "number")
  const [venture, { setQueryData }] = useQuery(
    getVenture,
    { id: ventureId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateVentureMutation] = useMutation(updateVenture)

  return (
    <>
      <Head>
        <title>Edit Venture {venture.id}</title>
      </Head>

      <div>
        <VentureForm
          submitText="Update Venture"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateVenture}
          initialValues={venture}
          subtitle={"Edit " + venture.title}
          onSubmit={async (values) => {
            try {
              const updated = await updateVentureMutation({
                id: venture.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowVenturePage({ ventureId: updated.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditVenturePage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditVenture />
      </Suspense>
    </div>
  )
}

EditVenturePage.authenticate = true
EditVenturePage.getLayout = (page) => <Layout>{page}</Layout>

export default EditVenturePage
