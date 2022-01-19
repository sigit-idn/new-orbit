import { forwardRef, ComponentPropsWithoutRef, PropsWithoutRef } from "react"
import { useField, UseFieldConfig } from "react-final-form"

export interface LabeledDateFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "date"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
  fieldProps?: UseFieldConfig<string>
}

export const LabeledDateField = forwardRef<HTMLInputElement, LabeledDateFieldProps>(
  ({ name, label, outerProps, fieldProps, labelProps, ...props }, ref) => {
    let {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name, { ...fieldProps })

    const year = new Date(input.value).getFullYear()
    const month = ("0" + (new Date(input.value).getMonth() + 1)).match(/\d{2}$/)
    const date = ("0" + new Date(input.value).getDate()).match(/\d{2}$/)

    input = {
      ...input,
      value: [year, month, date].join("-"),
    }

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    return (
      <div {...outerProps}>
        <label {...labelProps} className="relative flex-1 mr-2 last:mr-0 mb-3 flex items-center">
          <span className="absolute left-3 -top-2 font-light text-xs bg-white px-2 text-gray-600 capitalize">
            {label}
          </span>
          <input
            {...input}
            disabled={submitting}
            {...props}
            ref={ref}
            className="flex-1 outline-0 font-light border focus:border-indigo-500 rounded-md px-5 py-3"
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

export default LabeledDateField
