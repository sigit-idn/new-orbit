import { FC, Suspense, useEffect, useState } from "react"
import {
  Head,
  usePaginatedQuery,
  useRouter,
  BlitzPage,
  Routes,
  useMutation,
  useQuery,
  Link,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import getDeals from "app/deals/queries/getDeals"
import { DealStatus, Deal } from "@prisma/client"
import daysleft from "daysleft"
import { Clock, Star, User } from "app/core/components/Icons"
import { Droppable, Draggable, DragDropContext } from "react-beautiful-dnd"
import updateDeal from "app/deals/mutations/updateDeal"
import getUsers from "app/users/queries/getUsers"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

// const ITEMS_PER_PAGE = 100
interface SearchProps {
  searchValues?: {
    title: string
    dealOwnerId?: number
    isStarredOnly?: 0 | 1 | boolean
  }
  setSearchValues?: Function
}

export const DealsList: FC<SearchProps> = ({ searchValues }) => {
  const router = useRouter()
  const currentUser = useCurrentUser()

  if (!currentUser) {
    router.push(Routes.LoginPage())
  }

  const [updateDealMutation] = useMutation(updateDeal)
  // const page = Number(router.query.page) || 0
  interface Where {
    title?: { contains: string; mode?: "insensitive" } | string
    dealOwnerId?: number
    isStarred?: true
  }
  const [where, setWhere] = useState<Where>({
    title: { contains: searchValues?.title!, mode: "insensitive" },
    dealOwnerId: searchValues?.dealOwnerId,
    isStarred: searchValues?.isStarredOnly ? true : undefined,
  })

  useEffect(() => {
    if (
      searchValues?.title == (where.title as { contains: string })?.contains &&
      where.dealOwnerId == searchValues?.dealOwnerId &&
      where.isStarred == (searchValues?.isStarredOnly ? true : undefined)
    )
      return

    const newWhere: Where = {
      title: { contains: searchValues?.title ?? "", mode: "insensitive" },
      dealOwnerId: searchValues?.dealOwnerId,
      isStarred: true,
    }

    if (!searchValues?.dealOwnerId) delete newWhere.dealOwnerId
    if (!searchValues?.isStarredOnly) delete newWhere.isStarred

    setWhere(newWhere)
  }, [searchValues])

  const [{ deals }] = useQuery(getDeals, {
    orderBy: { dueDate: "desc" },
    where,
  })

  const dealStatus = Object.keys(DealStatus)

  const dragEndHandler = (result) => {
    if (!result.destination) return

    deals.forEach((deal) => {
      if (deal.id == result.draggableId.match(/\d+$/)[0]) {
        deal.status =
          DealStatus[result.destination.droppableId.match(new RegExp(dealStatus.join("|")))]

        updateDealMutation(deal).catch((err) => console.log(err))
      }
    })
  }

  return (
    <DragDropContext onDragEnd={dragEndHandler}>
      <div className="flex w-max p-8 space-x-5 bg-white">
        {dealStatus.map((status, i) => (
          <Droppable key={"status" + i} droppableId={"deal" + status} type="GROUP">
            {(provided) => (
              <ul
                className="rounded-md bg-gray-300 px-3 h-max"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <h3 className="w-max mx-auto bg-indigo-400 rounded text-white uppercase text-sm px-2 m-3">
                  {Array.from(status)
                    .map((letter, i) => (i && /[A-Z]/.test(letter) ? " " : "") + letter)
                    .join("")}
                </h3>

                {!deals.length && (
                  <Draggable key={"empty"} draggableId={"empty"} index={0} id={"empty"}>
                    {(provided) => (
                      <li
                        className="mb-2 w-full h-72"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      ></li>
                    )}
                  </Draggable>
                )}

                {deals.map((deal, j) => {
                  const daysLeft = daysleft(deal.dueDate)
                  const leftOrOverdue = daysLeft >= 0 ? " left" : " overdue"
                  const dayOrDays = Math.abs(daysLeft) < 2 ? " day" : " days"

                  const toggleStarred = () => {
                    updateDealMutation({ ...deal, isStarred: !deal.isStarred })
                      .then(() => (deal.isStarred = !deal.isStarred))
                      .catch((err) => console.error(err))
                  }

                  if (deal.status === status)
                    return (
                      <Draggable
                        key={"deal" + deal.id}
                        draggableId={"deal" + deal.id}
                        index={i}
                        id={"deal" + deal.id}
                      >
                        {(provided) => (
                          <li
                            className="rounded-md bg-white mb-3 w-72"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="capitalize px-3 border-b flex justify-between items-center text-lg py-3 leading-tight cursor-pointer">
                              <Link href={Routes.EditDealPage({ dealId: deal.id })}>
                                <h4>{deal.title}</h4>
                              </Link>
                              <button
                                onClick={toggleStarred}
                                className="transform active:scale-125 transition-transform"
                              >
                                <Star color={deal.isStarred ? "#5048E5" : undefined} />
                              </button>
                            </div>
                            <ul className="p-3">
                              <li className="flex items-center space-x-2">
                                <Clock />
                                <span
                                  className={leftOrOverdue === " overdue" ? "text-red-700" : ""}
                                >
                                  {Math.abs(daysLeft) + dayOrDays + leftOrOverdue}
                                </span>
                              </li>
                              <li className="flex items-center space-x-2">
                                <User />
                                <span>{deal.dealOwner?.name}</span>
                              </li>
                              <li className="flex items-center space-x-2">
                                <User color="#828DF8" />
                                <span>{deal.dealChampion?.name}</span>
                              </li>
                            </ul>
                          </li>
                        )}
                      </Draggable>
                    )
                })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  )
}

const DealsPage: BlitzPage<SearchProps> = ({ searchValues }) => {
  return (
    <>
      <Head>
        <title>Deals</title>
      </Head>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <DealsList searchValues={searchValues} />
        </Suspense>
      </div>
    </>
  )
}

export const SearchOptions: FC<SearchProps> = ({ searchValues, setSearchValues }) => {
  const [users] = useQuery(getUsers, undefined)
  const liveFilter = ({ target }) => {
    if (setSearchValues) setSearchValues({ ...searchValues, [target.name]: Number(target.value) })
  }

  return (
    <div>
      <select className="p-3 h-full rounded-l-md border" name="dealOwnerId" onChange={liveFilter}>
        <option value={0}>Select Deal Owner</option>
        {users.map((user) => (
          <option key={"user" + user.id} value={user.id}>
            {user.username}
          </option>
        ))}
      </select>
      <select className="p-3 h-full rounded-r-md border" name="isStarredOnly" onChange={liveFilter}>
        <option value={0}>View All Deals</option>
        <option value={1}>View Starred Deals Only</option>
      </select>
    </div>
  )
}

DealsPage.authenticate = true
DealsPage.getLayout = (page) => <Layout searchOptions={<SearchOptions />}>{page}</Layout>

export default DealsPage
