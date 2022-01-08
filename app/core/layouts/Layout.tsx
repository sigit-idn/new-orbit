import { Head, BlitzLayout } from "blitz"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"

const Layout: BlitzLayout<{ title?: string }> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title || "orbit"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-screen h-screen flex overflow-y-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="overflow-y-scroll bg-gray-200 flex-1">{children}</main>
        </div>
      </div>
    </>
  )
}

export default Layout
