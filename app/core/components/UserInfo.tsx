import { FC } from "react"
import { useCurrentUser } from "../hooks/useCurrentUser"

const UserInfo: FC = () => {
  const currentUser = useCurrentUser()

  return (
    <div className="bg-gray-800 rounded-md p-5 w-full my-5">
      <h3 className="text-white font-semibold">Team A</h3>
      <span>User: {currentUser?.name}</span>
    </div>
  )
}

export default UserInfo
