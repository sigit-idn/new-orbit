import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createVenture from "app/ventures/mutations/createVenture"
import { VentureForm, FORM_ERROR } from "app/ventures/components/VentureForm"

const NewVenturePage: BlitzPage = () => {
  const router = useRouter()
  const [createVentureMutation] = useMutation(createVenture)

  return (
    <div>
      <h1>Create New Venture</h1>

      <VentureForm
        submitText="Create Venture"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateVenture}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const venture = await createVentureMutation(values)
            router.push(Routes.ShowVenturePage({ ventureId: venture.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.VenturesPage()}>
          <a>Ventures</a>
        </Link>
      </p>
    </div>
  )
}

NewVenturePage.authenticate = true
NewVenturePage.getLayout = (page) => <Layout title={"Create New Venture"}>{page}</Layout>

export default NewVenturePage
