import { AuthenticationError, Link, useMutation, Routes, PromiseReturnType } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import login from "app/auth/mutations/login"
import { Login } from "app/auth/validations"

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <h1 className="text-2xl font-bold text-center text-gray-900">Login</h1>

      <Form
        submitText="Login"
        schema={Login}
        initialValues={{ username: "", password: "" }}
        hideBackButton={true}
        onSubmit={async (values) => {
          try {
            const user = await loginMutation(values)
            props.onSuccess?.(user)
          } catch (error: any) {
            if (error instanceof AuthenticationError) {
              return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
            } else {
              return {
                [FORM_ERROR]:
                  "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
              }
            }
          }
        }}
      >
        <LabeledTextField
          name="username"
          label="Username"
          className="valid:bg-white"
          placeholder="Username"
        />
        <LabeledTextField
          name="password"
          label="Password"
          className="valid:bg-white"
          placeholder="Password"
          type="password"
        />
      </Form>

      <div className="mt-3 text-right">
        Or{" "}
        <Link href={Routes.SignupPage ? Routes.SignupPage() : "#"}>
          <a className="underline text-sm text-gray-600 hover:text-gray-900">Sign Up</a>
        </Link>
      </div>
    </div>
  )
}

export default LoginForm
