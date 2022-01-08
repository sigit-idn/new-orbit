import { Image } from "blitz"
import { FC } from "react"
import { Bell, Search } from "./Icons"

const Header: FC = () => {
  return (
    <header className="flex items-center justify-between py-3 px-5">
      <Search />
      <div className="flex items-center justify-between w-16">
        <Bell />
        <Image src="/avatar.png" alt="avatar" width={30} height={30} />
      </div>
    </header>
  )
}

export default Header
