import { ReactNode, PropsWithoutRef } from "react"
import { Form as FinalForm, FormProps as FinalFormProps } from "react-final-form"
import { z } from "zod"
import { Router, validateZodSchema } from "blitz"
import { ArrowLeft } from "./Icons"
export { FORM_ERROR } from "final-form"

export interface FormProps<S extends z.ZodType<any, any>>
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit"> {
  /** All your form fields */
  children?: ReactNode
  /** Text to display in the submit button */
  submitText?: string
  schema?: S
  subtitle?: true | string
  onSubmit: FinalFormProps<z.infer<S>>["onSubmit"]
  initialValues?: FinalFormProps<z.infer<S>>["initialValues"]
  hideBackButton?: boolean
}

export function Form<S extends z.ZodType<any, any>>({
  children,
  submitText,
  schema,
  initialValues,
  title,
  subtitle,
  onSubmit,
  hideBackButton,
  ...props
}: FormProps<S>) {
  return (
    <FinalForm
      initialValues={initialValues}
      validate={validateZodSchema(schema)}
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, submitError }) => (
        <form onSubmit={handleSubmit} {...props}>
          {!hideBackButton && (
            <button
              type="button"
              onClick={() => Router.back()}
              className="flex items-center space-x-2 text-indigo-600 mb-8"
            >
              <ArrowLeft /> <span>Back to {submitText?.match(/\w+$/)}s</span>
            </button>
          )}
          {title && <h1 className="text-2xl font-semibold">{title}</h1>}
          {/* Form fields supplied as children are rendered here */}
          <div className="bg-white rounded-lg p-5 mt-3">
            {/* {subtitle && (
              <h2 className="mb-3 text-lg">New {subtitle ?? submitText?.match(/\w+$/)}</h2>
              )} */}
            {!hideBackButton && (
              <h2 className="mb-3 text-lg">{subtitle ?? "New " + submitText?.match(/\w+$/)}</h2>
            )}
            <div
              className="border-t border-gray-200 mt-5 mb-6 -ml-5"
              style={{ width: "calc(100% + 2.5rem)" }}
            ></div>
            {children}
            {submitError && (
              <div role="alert" style={{ color: "red" }}>
                {submitError}
              </div>
            )}

            <div
              className="border-t border-gray-200 mt-6 -ml-5"
              style={{ width: "calc(100% + 2.5rem)" }}
            ></div>

            {submitText && (
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-white ml-auto mt-5 block text-sm"
                disabled={submitting}
              >
                {submitText}
              </button>
            )}
          </div>
        </form>
      )}
    />
  )
}

export default Form
