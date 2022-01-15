import { Form, FormProps } from "app/core/components/Form"
import LabeledDateField from "app/core/components/LabeledDateField"
import LabeledTextArea from "app/core/components/LabeledTextArea"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { SelectField } from "app/core/components/SelectField"
import getDeals from "app/deals/queries/getDeals"
import getUsers from "app/users/queries/getUsers"
import { useQuery } from "blitz"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function TaskForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const [users] = useQuery(getUsers, undefined)
  const [{ deals }] = useQuery(getDeals, {})
  return (
    <Form<S> {...props}>
      <LabeledTextField name="title" label="Title" placeholder="Title" />
      <LabeledDateField type="date" name="dueDate" label="Due Date" placeholder="Due Date" />
      <LabeledTextArea name="description" label="Description" placeholder="Description" />
      <SelectField name="userId" placeholder="Select Asignee">
        {users.map((user) => (
          <option key={"user" + user.id} value={user.id}>
            {user.username}
          </option>
        ))}
      </SelectField>
      <SelectField name="dealId" placeholder="Select Related Deal">
        {deals.map((deal) => (
          <option key={"deal" + deal.id} value={deal.id}>
            {deal.title}
          </option>
        ))}
      </SelectField>
    </Form>
  )
}
