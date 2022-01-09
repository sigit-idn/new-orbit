import { Head, BlitzLayout, useRouter, RouteUrlObject, Link } from "blitz"
import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  Suspense,
  useState,
} from "react"
import Header from "../components/Header"
import { Search } from "../components/Icons"
import Sidebar from "../components/Sidebar"

const Layout: BlitzLayout<{
  title?: string
  createHref?: string | RouteUrlObject
  searchOptions?: ReactNode | ReactElement
}> = ({ title, createHref, children, searchOptions }) => {
  const { pathname } = useRouter()
  const [searchValues, setSearchValues] = useState({})

  const liveSearch = ({ target }) => setSearchValues({ title: target.value })

  title = title ?? pathname.match(/\w+$/)?.[0]

  return (
    <>
      <Head>
        <title>{title || "orbit"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-screen h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="overflow-y-scroll bg-gray-200 flex-1 px-6 py-10">
            <div className="mb-5 flex justify-between">
              <h1 className="text-3xl capitalize font-semibold">{title}</h1>
              <Link href={createHref ?? "/"}>
                <a className="capitalize bg-indigo-600 text-white px-3 py-2 rounded-md">
                  Add {title?.replace(/s$/, "")}
                </a>
              </Link>
            </div>

            <form className="flex bg-white rounded-lg p-8 justify-between">
              <label
                htmlFor="searchInput"
                className="relative border rounded-md p-3 flex-1 mr-2 last:mr-0 flex items-center"
              >
                <span className="absolute left-3 -top-2 font-light text-xs bg-white px-2 text-gray-600 capitalize">
                  Search {title}
                </span>
                <Search />
                <input
                  id="searchInput"
                  type="text"
                  className="flex-1 ml-2 outline-0"
                  onInput={liveSearch}
                />
              </label>
              <Suspense fallback="Loading...">
                {isValidElement(searchOptions) &&
                  cloneElement(searchOptions, { searchValues, setSearchValues })}
              </Suspense>
            </form>
            <div
              className="bg-white rounded-md mt-8 overflow-x-scroll w-full"
              style={{ maxWidth: "calc(100vw - 20rem)" }}
            >
              {Children.map(children, (child) => {
                if (isValidElement(child)) {
                  return cloneElement(child, { searchValues })
                }
                return child
              })}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default Layout
