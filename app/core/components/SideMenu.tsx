import { Link, useRouter } from "blitz"
import { cloneElement, FC, ReactElement, useEffect, useState } from "react"
interface SideMenuProps {
  href: string
  title: string
  icon: ReactElement
}

const SideMenu: FC<SideMenuProps> = ({ href, title, icon }) => {
  const { pathname } = useRouter()
  const [isActive, setIsActive] = useState(false)
  useEffect(() => setIsActive(pathname === href), [pathname])

  return (
    <>
      <Link href={href}>
        <a
          className={`p-3 font-semibold flex items-center mb-3 hover:bg-gray-800 w-full rounded-md ${
            isActive && "bg-gray-800 bg-opacity-80"
          }`}
        >
          {cloneElement(icon, { color: isActive ? "#5048E5" : null })}
          <span className="ml-3">{title}</span>
        </a>
      </Link>
    </>
  )
}

export default SideMenu
