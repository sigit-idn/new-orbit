import { useRouter, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import { LoginForm } from "app/auth/components/LoginForm"

const LoginPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <div>
      <LoginForm
        onSuccess={(_user) => {
          const next = router.query.next
            ? decodeURIComponent(router.query.next as string)
            : "/deals"

          window.location.href = next
        }}
      />
    </div>
  )
}

LoginPage.redirectAuthenticatedTo = "/deals"
LoginPage.getLayout = (page) => page

export default LoginPage
