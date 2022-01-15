import { FC, Suspense, useEffect, useState } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getVentures from "app/ventures/queries/getVentures"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en.json"
import { ChevronLeft, ChevronRight, Clock } from "app/core/components/Icons"

const ITEMS_PER_PAGE = 6

interface SearchProps {
  searchValues?: {
    title: string
  }
  setSearchValues?: Function
}

export const VenturesList: FC<SearchProps> = ({ searchValues }) => {
  TimeAgo.addDefaultLocale(en)
  const getTimeAgo = new TimeAgo("en-US")
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [where, setWhere] = useState({})

  useEffect(() => {
    setWhere({
      ...where,
      title: { contains: searchValues?.title, mode: "insensitive" },
    })
  })

  const [{ ventures, hasMore, count }] = usePaginatedQuery(getVentures, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
    where,
  })

  const pages = Math.ceil(count / ITEMS_PER_PAGE)

  const pageNumbers = Array.from({ length: pages }, (_, i) => i)

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul className="flex flex-wrap -ml-3" style={{ width: "calc(100% + 1.5rem)" }}>
        {ventures.map((venture) => (
          <li key={venture.id} className="w-1/3 py-2 px-3 flex text-gray-900">
            <Link href={Routes.EditVenturePage({ ventureId: venture.id })}>
              <a className="rounded-md bg-white p-3 text-center flex flex-col flex-1">
                <div className="flex-1">
                  <div></div>
                  <h3 className="font-semibold text-xl mb-3">{venture.title}</h3>
                  <p className="font-light">{venture.description}</p>
                </div>

                <div className="border-b -ml-5 my-3" style={{ width: "calc(100% + 20rem)" }}></div>

                <div className="flex items-center justify-center font-light space-x-2 text-sm">
                  <Clock /> <span>{getTimeAgo.format(venture.updatedAt)}</span>
                </div>
              </a>
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex my-5 justify-center">
        <button
          disabled={page === 0}
          onClick={goToPreviousPage}
          className={`${
            page === 0 ? "opacity-50 mr-5" : "mr-5"
          } transition-transform transform active:scale-125`}
        >
          <ChevronLeft />
        </button>
        {pageNumbers.map((number) => (
          <button
            onClick={() => router.push({ query: { page: number } })}
            className={`rounded-full w-10 h-10 flex justify-center items-center transition-colors transform active:scale-125 ${
              page === number ? "bg-indigo-500 text-white" : ""
            }`}
            key={"page" + (number + 1)}
          >
            {number + 1}
          </button>
        ))}
        <button
          disabled={!hasMore}
          onClick={goToNextPage}
          className={`${
            !hasMore ? "opacity-50 ml-5" : "ml-5"
          } transition-transform transform active:scale-125`}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  )
}

const VenturesPage: BlitzPage<SearchProps> = ({ searchValues }) => {
  return (
    <>
      <Head>
        <title>Ventures</title>
      </Head>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <VenturesList searchValues={searchValues} />
        </Suspense>
      </div>
    </>
  )
}

VenturesPage.authenticate = true
VenturesPage.getLayout = (page) => <Layout>{page}</Layout>

export default VenturesPage
