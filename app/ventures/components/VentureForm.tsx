import { Form, FormProps } from "app/core/components/Form"
import LabeledTextArea from "app/core/components/LabeledTextArea"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import TagsInputField from "app/core/components/TagsInputField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function VentureForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="title" label="Title" placeholder="Title" />
      <LabeledTextArea name="description" label="Website" placeholder="Website" />
      <TagsInputField name="tags" label="Tags" placeholder="Tags" />
    </Form>
  )
}
