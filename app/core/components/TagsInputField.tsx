import { forwardRef, ComponentPropsWithoutRef, PropsWithoutRef, useState } from "react"
import { useField, UseFieldConfig } from "react-final-form"

export interface TagsInputFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
  fieldProps?: UseFieldConfig<string>
}

export const TagsInputField = forwardRef<HTMLInputElement, TagsInputFieldProps>(
  ({ name, label, outerProps, fieldProps, labelProps, ...props }, ref) => {
    const [tags, setTags] = useState([])
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name, {
      parse:
        props.type === "number"
          ? (Number as any)
          : // Converting `""` to `null` ensures empty values will be set to null in the DB
            (v) => (v === "" ? null : v),
      ...fieldProps,
    })

    const inputTag = ({ target }) => setTags(target.value.replace(/\s*,\s*/g, ",").split(","))

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    return (
      <div {...outerProps}>
        <label {...labelProps} className="relative flex-1 mr-2 last:mr-0 mb-3 flex items-center">
          <span className="absolute left-3 -top-2 font-light text-xs bg-white px-2 text-gray-600 capitalize">
            {label}
          </span>

          <div className="absolute left-5">
            {tags.map(
              (tag: string) =>
                !!tag.length && (
                  <span
                    className="rounded text-white bg-indigo-400 text-sm px-2 pt-0.5 pb-1 mr-1"
                    key={tag}
                  >
                    {tag}
                  </span>
                )
            )}
          </div>

          <input
            onInput={inputTag}
            {...input}
            disabled={submitting}
            {...props}
            ref={ref}
            className="flex-1 ml-2 outline-0 text-transparent border focus:border-indigo-500 rounded-md p-3"
          />
        </label>

        {touched && normalizedError && (
          <div role="alert" style={{ color: "red" }}>
            {normalizedError}
          </div>
        )}
      </div>
    )
  }
)

export default TagsInputField
