import { Image } from "blitz"
import { FC, Suspense } from "react"
import { ChartBar, ShoppingBag, User, Users } from "./Icons"
import SideMenu from "./SideMenu"
import UserInfo from "./UserInfo"

const Sidebar: FC = () => {
  return (
    <aside className="bg-gray-900 w-72 h-full p-5 flex flex-col items-start text-gray-200">
      <Image src="/logo-orbit.svg" width={50} height={50} alt="Logo Orbit" />
      <Suspense fallback={"Loading..."}>
        <UserInfo />
      </Suspense>
      <div className="mt-5 pt-5 border-t border-gray-700 w-full">
        <SideMenu href="/" icon={<ChartBar />} title="Dashboard" />
        <SideMenu href="/deals" icon={<Users />} title="Deals" />
        <SideMenu href="/ventures" icon={<ShoppingBag />} title="Ventures" />
        <SideMenu href="/tasks" icon={<User />} title="Tasks" />
      </div>
    </aside>
  )
}

export default Sidebar
