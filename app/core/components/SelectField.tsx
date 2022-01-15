import React, { forwardRef, PropsWithoutRef, ReactNode } from "react"
import { useField, UseFieldConfig } from "react-final-form"

export interface SelectFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["select"]> {
  /** Field name. */
  name: string
  /** Field label. */
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  fieldProps?: UseFieldConfig<string>
  options?: Array<{ id: number; username: string } | string>
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ name, fieldProps, outerProps, options, placeholder, children, ...props }, ref) => {
    const {
      input,
      meta: { submitting },
    } = useField(name, {
      ...((props.type === "number"
        ? { parse: (v: string) => Number(v) }
        : {
            parse: (v: string) => (v === "" ? null : v),
          }) as any),
      ...fieldProps,
    })

    return (
      // <div {...outerProps} className="mb-3 flex-1">
      <select
        {...input}
        disabled={submitting}
        {...props}
        ref={ref}
        className={"font-light border block rounded-md p-3 w-full mb-1"}
      >
        <option value={0}>{placeholder}</option>
        {children}
      </select>
      // </div>
    )
  }
)
