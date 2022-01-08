import { FC, Suspense } from "react"
import { Head, usePaginatedQuery, useRouter, BlitzPage, Routes, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import getDeals from "app/deals/queries/getDeals"
import { DealStatus } from "@prisma/client"
import daysleft from "daysleft"
import { Clock, Star, User } from "app/core/components/Icons"
import { Droppable, Draggable, DragDropContext } from "react-beautiful-dnd"
import updateDeal from "app/deals/mutations/updateDeal"

const ITEMS_PER_PAGE = 100

export const DealsList: FC = () => {
  const router = useRouter()
  const [updateDealMutation] = useMutation(updateDeal)
  const page = Number(router.query.page) || 0
  const [{ deals, hasMore }] = usePaginatedQuery(getDeals, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const dealStatus = Object.keys(DealStatus)

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  const dragEndHandler = (result) => {
    if (!result.destination) return

    deals.forEach((deal) => {
      if (deal.id == result.draggableId.match(/\d+/)[0]) {
        deal.status =
          DealStatus[result.destination.droppableId.match(new RegExp(dealStatus.join("|")))]

        updateDealMutation(deal).catch((err) => console.log(err))
      }
    })
  }

  return (
    <DragDropContext onDragEnd={dragEndHandler}>
      <div className="flex w-max p-8 space-x-5">
        {dealStatus.map((status, i) => (
          <Droppable key={"status" + i} droppableId={"deal" + status} type="GROUP">
            {(provided) => (
              <ul
                className="rounded-md bg-gray-300 px-3 h-max"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <h3 className="w-max mx-auto bg-indigo-400 rounded text-white uppercase text-sm px-2 m-3">
                  {Array.from(status).map(
                    (letter, i) => (i && /[A-Z]/.test(letter) ? " " : "") + letter
                  )}
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
                            className="rounded-md bg-white mb-3"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="capitalize px-3 border-b flex justify-between items-center text-lg h-12">
                              <h4>{deal.title}</h4>
                              <Star />
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
                                <span>{deal.User?.name}</span>
                              </li>
                              <li className="flex items-center space-x-2">
                                <User color="#828DF8" />
                                <span>{deal.dealOwner?.name}</span>
                              </li>
                            </ul>
                          </li>
                        )}
                      </Draggable>
                    )
                })}
              </ul>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  )
}

const DealsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Deals</title>
      </Head>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <DealsList />
        </Suspense>
      </div>
    </>
  )
}

DealsPage.authenticate = true
DealsPage.getLayout = (page) => <Layout createHref={Routes.NewDealPage()}>{page}</Layout>

export default DealsPage
