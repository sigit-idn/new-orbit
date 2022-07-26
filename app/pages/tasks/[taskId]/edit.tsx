import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getTask from "app/tasks/queries/getTask"
import updateTask from "app/tasks/mutations/updateTask"
import { TaskForm, FORM_ERROR } from "app/tasks/components/TaskForm"

export const EditTask = () => {
  const router = useRouter()
  const taskId = useParam("taskId", "number")
  const [task, { setQueryData }] = useQuery(
    getTask,
    { id: taskId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateTaskMutation] = useMutation(updateTask)

  return (
    <>
      <Head>
        <title>Edit Task {task.id}</title>
      </Head>

      <div>
        <TaskForm
          submitText="Update Task"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateTask}
          initialValues={task}
          subtitle={"Edit " + task.title}
          onSubmit={async (values) => {
            values.dueDate = new Date(values.dueDate ?? "")
            values.userId = Number(values.userId)
            values.dealId = Number(values.dealId)

            try {
              const updated = await updateTaskMutation({
                id: task.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.TasksPage())
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

const EditTaskPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditTask />
      </Suspense>
    </div>
  )
}

EditTaskPage.authenticate = true
EditTaskPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditTaskPage
