import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createVenture from "app/ventures/mutations/createVenture"
import { VentureForm, FORM_ERROR } from "app/ventures/components/VentureForm"

const NewVenturePage: BlitzPage = () => {
  const router = useRouter()
  const [createVentureMutation] = useMutation(createVenture)

  return (
    <div>
      <VentureForm
        submitText="Create Venture"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateVenture}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            await createVentureMutation(values)
            router.push(Routes.VenturesPage())
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />
    </div>
  )
}

NewVenturePage.authenticate = true
NewVenturePage.getLayout = (page) => <Layout title={"Create New Venture"}>{page}</Layout>

export default NewVenturePage
