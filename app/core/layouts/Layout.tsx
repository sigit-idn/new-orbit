import { Head, useRouter, RouteUrlObject, Link } from "blitz"
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

const Layout: React.FC<{
  title?: string
  searchOptions?: ReactNode | ReactElement
}> = ({ title, children, searchOptions }) => {
  const { pathname } = useRouter()
  const [searchValues, setSearchValues] = useState({})

  const liveSearch = ({ target }) => setSearchValues({ ...searchValues, title: target.value })

  title = title ?? pathname.match(/\w+$/)?.[0]

  return (
    <>
      <Head>
        <title>{title || "orbit"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-screen h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col bg-gray-200 h-screen">
          <Header />
          <main className="flex-1 w-full p-8 max-w-7xl mx-auto flex flex-col overflow-hidden">
            {(pathname.match(/\//g)?.length ?? 0) <= 1 && (
              <>
                <div className="mb-5 flex justify-between">
                  <h1 className="text-3xl capitalize font-semibold">{title}</h1>
                  <Link href={`/${pathname.match(/\w+$/)}/new`}>
                    <a className="capitalize bg-indigo-600 text-white px-3 py-2 rounded-md">
                      Add {title?.replace(/s$/, "")}
                    </a>
                  </Link>
                </div>

                <form className="flex bg-white rounded-lg p-8 justify-between mb-6">
                  <label
                    htmlFor="searchInput"
                    className="relative flex-1 mr-2 last:mr-0 flex items-center"
                  >
                    <span className="absolute left-3 -top-2 font-light text-xs bg-white px-2 text-gray-600 capitalize">
                      Search {title}
                    </span>
                    <span className="absolute left-3">
                      <Search />
                    </span>
                    <input
                      id="searchInput"
                      type="text"
                      className="flex-1 outline-0 font-light border focus:border-indigo-500 rounded-md p-3 pl-10"
                      onInput={liveSearch}
                    />
                  </label>
                  <Suspense fallback="Loading...">
                    {isValidElement(searchOptions) &&
                      cloneElement(searchOptions, { searchValues, setSearchValues })}
                  </Suspense>
                </form>
              </>
            )}
            <div
              className="rounded-md overflow-scroll w-full flex-1"
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
