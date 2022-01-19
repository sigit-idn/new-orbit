import logout from "app/auth/mutations/logout"
import { useMutation } from "blitz"
import { FC, useState } from "react"
import { useCurrentUser } from "../hooks/useCurrentUser"
import { ChevronUpDown } from "./Icons"

const UserInfo: FC = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)
  const [showLogout, setShowLogout] = useState(false)

  return (
    <div className="bg-gray-800 rounded-md p-5 w-full my-5">
      <button
        className="flex w-full text-left items-center justify-between"
        onClick={() => setShowLogout(!showLogout)}
      >
        <div>
          <h3 className="text-white font-semibold">Team A</h3>
          <span className="text-gray-200">User: {currentUser?.name}</span>
        </div>
        <ChevronUpDown />
      </button>
      <button
        className={`text-sm opacity-80 hover:opacity-100 border-t border-gray-600 pt-2 mt-3 w-full text-left ${
          !showLogout ? "hidden" : ""
        }`}
        onClick={() => logoutMutation()}
      >
        Logout
      </button>
    </div>
  )
}

export default UserInfo
