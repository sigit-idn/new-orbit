import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createDeal from "app/deals/mutations/createDeal"
import { DealForm, FORM_ERROR } from "app/deals/components/DealForm"
import { Suspense } from "react"

const NewDealPage: BlitzPage = () => {
  const router = useRouter()
  const [createDealMutation] = useMutation(createDeal)

  return (
    <div>
      <Suspense fallback="Loading">
        <DealForm
          title="Add Deal"
          submitText="Add Deal"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={CreateDeal}
          // initialValues={{}}
          onSubmit={async (values) => {
            try {
              const data = {
                ...values,
                dealChampionId: Number(values.dealChampionId),
                dealOwnerId: Number(values.dealOwnerId),
                ventureId: Number(values.ventureId),
              }
              const deal = await createDealMutation(data)
              router.push(Routes.ShowDealPage({ dealId: deal.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </Suspense>
    </div>
  )
}

NewDealPage.authenticate = true
NewDealPage.getLayout = (page) => <Layout title={"Create New Deal"}>{page}</Layout>

export default NewDealPage
