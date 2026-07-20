import type { LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"

export const IsEmpty = ({text, href,link, Icon}:{
    text: string,
    link: string,
    href: string,
    Icon: LucideIcon
}) => {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center h-[calc(100dvh-300px)] justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orchid/15">
          <Icon className="h-6 w-6 text-orchid" strokeWidth={1.5} />
        </div>
        <p className="text-fog">{text}</p>
        <Link
          to={href}
          className="text-sm font-medium text-orchid transition hover:text-lavender px-3 py-2 bg-orchid/10 border border-orchid/30 rounded-lg hover:bg-orchid/20"
        >
          {link} →
        </Link>
      </div>
  )
}
