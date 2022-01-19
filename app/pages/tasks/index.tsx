import { Droppable, Draggable, DragDropContext } from "react-beautiful-dnd"
import daysleft from "daysleft"
import { FC, Suspense, useEffect, useState } from "react"
import {
  Head,
  Link,
  usePaginatedQuery,
  useRouter,
  BlitzPage,
  Routes,
  useMutation,
  useQuery,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import getTasks from "app/tasks/queries/getTasks"
import { Clock, Star, User } from "app/core/components/Icons"
import updateTask from "app/tasks/mutations/updateTask"
import { TaskStatus } from "@prisma/client"
import getUsers from "app/users/queries/getUsers"

const ITEMS_PER_PAGE = 100

interface searchProps {
  searchValues?: {
    title: string
    userId?: number
  }
  setSearchValues?: Function
}

export const TasksList = ({ searchValues }) => {
  const router = useRouter()
  // const page = Number(router.query.page) || 0
  const [updateTaskMutation] = useMutation(updateTask)
  const [where, setWhere] = useState({})

  useEffect(() => {
    const newWhere = {
      title: { contains: searchValues?.title, mode: "insensitive" },
      userId: searchValues.userId,
    }

    if (!searchValues?.userId) delete newWhere.userId

    setWhere(newWhere)
  }, [searchValues])

  const [{ tasks }] = useQuery(getTasks, {
    orderBy: { dueDate: "desc" },
    where,
  })

  // const [{ tasks, hasMore }] = usePaginatedQuery(getTasks, {
  //   orderBy: { id: "asc" },
  //   skip: ITEMS_PER_PAGE * page,
  //   take: ITEMS_PER_PAGE,
  //   where,
  // })

  // const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  // const goToNextPage = () => router.push({ query: { page: page + 1 } })

  const taskStatus = Object.keys(TaskStatus)

  const dragEndHandler = (result) => {
    if (!result.destination) return

    tasks.forEach((task) => {
      if (task.id == result.draggableId.match(/\d+$/)[0]) {
        const [taskStatusKey] = result.destination.droppableId.match(
          new RegExp(taskStatus.join("|"))
        )

        task.userId = Number(task.userId)

        updateTaskMutation({
          ...task,
          status: TaskStatus[taskStatusKey],
        })
          .then(() => (task.status = taskStatusKey))
          .catch((err) => console.error(err))
      }
    })
  }

  return (
    <DragDropContext onDragEnd={dragEndHandler}>
      <div className="flex p-8 space-x-5 bg-white">
        {taskStatus.map((status, i) => (
          <Droppable key={"status" + i} droppableId={"task" + status} type="GROUP">
            {(provided) => (
              <ul
                className="rounded-md bg-gray-300 px-3 h-max flex-1"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <h3 className="w-max mx-auto bg-indigo-400 rounded text-white uppercase text-sm px-2 m-3">
                  {status}
                </h3>

                {!tasks.length && (
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

                {tasks.map((task, j) => {
                  const daysLeft = daysleft(task.dueDate)
                  const leftOrOverdue = daysLeft >= 0 ? " left" : " overdue"
                  const dayOrDays = Math.abs(daysLeft) < 2 ? " day" : " days"

                  if (task.status === status)
                    return (
                      <Draggable
                        key={"task" + task.id}
                        draggableId={"task" + task.id}
                        index={i}
                        id={"task" + task.id}
                      >
                        {(provided) => (
                          <li
                            className="rounded-md bg-white mb-3"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="capitalize px-3 border-b flex justify-between items-center text-lg py-3 leading-tight cursor-pointer">
                              <Link href={Routes.EditTaskPage({ taskId: task.id })}>
                                <h4>{task.title}</h4>
                              </Link>
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
                                <span>{task.assigned_to?.name}</span>
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

export const SearchOptions: FC<searchProps> = ({ searchValues, setSearchValues }) => {
  const [users] = useQuery(getUsers, undefined)
  const liveFilter = ({ target }) => {
    if (setSearchValues) setSearchValues({ ...searchValues, [target.name]: parseInt(target.value) })
  }

  return (
    <div>
      <select className="p-3 h-full rounded-l-md border" name="userId" onChange={liveFilter}>
        <option value="">Select Assignee</option>
        {users.map((user) => (
          <option key={"user" + user.id} value={user.id}>
            {user.username}
          </option>
        ))}
      </select>
    </div>
  )
}

const TasksPage: BlitzPage<searchProps> = ({ searchValues }) => {
  return (
    <>
      <Head>
        <title>Tasks</title>
      </Head>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <TasksList searchValues={searchValues} />
        </Suspense>
      </div>
    </>
  )
}

TasksPage.authenticate = true
TasksPage.getLayout = (page) => <Layout searchOptions={<SearchOptions />}>{page}</Layout>

export default TasksPage
