import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createTask from "app/tasks/mutations/createTask"
import { TaskForm, FORM_ERROR } from "app/tasks/components/TaskForm"
import { Suspense } from "react"

const NewTaskPage: BlitzPage = () => {
  const router = useRouter()
  const [createTaskMutation] = useMutation(createTask)

  return (
    <div>
      <Suspense fallback="Loading...">
        <TaskForm
          submitText="Add Task"
          title="Add Task"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={CreateTask}
          // initialValues={{}}
          onSubmit={async (values) => {
            try {
              await createTaskMutation({
                ...values,
                dealId: Number(values.dealId),
                userId: Number(values.userId),
                dueDate: new Date(values.dueDate),
              })
              router.push(Routes.TasksPage())
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

NewTaskPage.authenticate = true
NewTaskPage.getLayout = (page) => <Layout title={"Create New Task"}>{page}</Layout>

export default NewTaskPage
