import { Suspense } from "react"
import { BlitzPage, useMutation, Routes, useRouter } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const router = useRouter()
  const [logoutMutation] = useMutation(logout)

  if (!currentUser) {
    router.push(Routes.LoginPage())
  }

  return (
    <>
      <h1 className=" font-mono">Welcome, {currentUser?.username}!</h1>
      <button
        className="button small"
        onClick={async () => {
          await logoutMutation()
        }}
      >
        Logout
      </button>
      <div className="transform scale-150">
        User id: <code>{currentUser?.id}</code>
        <br />
        User role: <code>{currentUser?.username}</code>
      </div>
    </>
  )
}

const Home: BlitzPage = () => {
  return (
    <div className="container">
      <main>
        <Suspense fallback="Loading...">
          <UserInfo />
        </Suspense>
      </main>
    </div>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
