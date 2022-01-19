import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { SelectField } from "app/core/components/SelectField"
import getUsers from "app/users/queries/getUsers"
import getVentures from "app/ventures/queries/getVentures"
import { Link, Routes, useQuery } from "blitz"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function DealForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const [{ ventures }] = useQuery(getVentures, {})
  const [users] = useQuery(getUsers, undefined)

  return (
    <Form<S> {...props}>
      <LabeledTextField name="title" label="Title" placeholder="Title" />
      <SelectField name="ventureId" placeholder="Select Venture Champion">
        {ventures.map((venture) => (
          <option key={"venture" + venture.id} value={venture.id}>
            {venture.title}
          </option>
        ))}
      </SelectField>
      <Link href={Routes.NewVenturePage()}>
        <a className="text-sm text-indigo-600">・ Create New Venture</a>
      </Link>
      <div className="flex space-x-2 mt-3">
        <SelectField name="dealOwnerId" placeholder="Select Deal Owner">
          {users.map((user) => (
            <option key={"user" + user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </SelectField>
        <SelectField name="dealChampionId" placeholder="Select Deal Champion">
          {users.map((user) => (
            <option key={"user" + user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </SelectField>
      </div>
    </Form>
  )
}
