import { Link } from 'react-router-dom'
import { MapPin, Tag, Calendar } from 'lucide-react'
import type { Community, EventItem } from '../types'
import type { ReactNode } from 'react'

type CardProps =
  | {
      type: "community";
      item: Community;
      badge?: ReactNode;
    }
  | {
      type: "event";
      item: EventItem;
      badge?: ReactNode;
    };
const Card = ({ type, item, badge }: CardProps) => (
    <Link
        to={type === 'community' ? `/communities/${item.id}` : `/events/${item.id}`}

        className="group bg-deep-ocean border border-fog/20 rounded-xl overflow-hidden hover:border-orchid/60 hover:-translate-y-1.5 transition-all duration-300 relative"
    >
        <img
            src={item.imageUrl || "/image_holder.jpg"}
            alt={type === "community" ? item.name : item.title}
            className="w-full h-48 object-cover"
        />
        {/* Role/status badge (top-left), only rendered when passed */}
        {badge && (
            <div className="absolute top-4 left-4 z-10">
                {badge}
            </div>
        )}
        <div className="absolute top-4 right-4">
            {/* Category badge */}
            <span className="inline-flex items-center gap-1 text-sm font-medium text-mist bg-orchid/70 border-2 border-lavender/80 px-2 py-0.5 rounded-full mb-2 group-hover:bg-black group-hover:text-white transition-colors duration-200 ">
                <Tag className="w-3.5 h-3.5" />
                {item.category}
            </span>
        </div>
        <div className="p-4">

            <h2 className="text-mist text-base font-medium mb-1 group-hover:text-purple-400 transition-colors truncate">
                {type === "community" ? item.name : item.title}
            </h2>
            <p className="text-lavender text-sm mb-3 line-clamp-2 text-ellipsis group-hover:underline underline-offset-4">{item.description}</p>

            <div className="flex items-center justify-between mt-auto self-end">
                <p className="text-mist/60 text-xs flex items-center gap-1 rounded-full border-2 px-2 py-0.5 border-lavender/50">
                    <MapPin className="w-3 h-3 text-fog" />
                    {item.location}
                </p>
                <p className="text-mist/60 text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
            </div>
        </div>
    </Link>
)

export default Card