import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import type { EventItem } from '../../types'

const EventAboutTab = ({ event }: { event: EventItem }) => {
  const community = event.community
  const createdBy = event.createdBy

  return (
    <div className="rounded-xl border border-gray-200 bg-deep-ocean p-5 shadow-sm space-y-4 text-mist">

      {/* Description */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-fog/80 mb-2">Description</p>
        <p className="text-sm text-fog/80 leading-relaxed whitespace-pre-wrap">{event.description}</p>
      </div>

      <hr className="border-stone" />

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {[
          { label: 'Category',    value: event.category },
          { label: 'Sub-category', value: event.subCategory?.replace(/([A-Z])/g, ' $1').trim() || '—' },
          { label: 'Location',    value: event.location },
          { label: 'Date',        value: new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
          { label: 'Time',        value: event.time || '—' },
          { label: 'Posted',      value: new Date(event.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs text-fog/60">{label}</p>
            <p className="font-medium text-fog/80">{value}</p>
          </div>
        ))}
      </div>

      {/* Community + Organiser */}
      {(community || createdBy) && (
        <>
          <hr className="border-stone" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {community && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-fog/60 mb-2">Community</p>
                <Link to={`/communities/${community.id}`} className="flex items-center gap-3 group">
                  {community.imageUrl ? (
                    <img src={community.imageUrl} alt={community.name} className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-600" />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-orchid/20 border border-orchid/30 flex items-center justify-center text-lavender text-xs font-medium">
                      {community.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-mist text-sm font-medium group-hover:text-lavender transition-colors">{community.name}</p>
                    {community.location && (
                      <p className="text-fog/50 text-xs flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {community.location}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            )}

            {createdBy && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-fog/60 mb-2">Organised by</p>
                <div className="flex items-center gap-3">
                  {createdBy.imageUrl ? (
                    <img src={createdBy.imageUrl} alt={createdBy.name} className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-600" />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-orchid/20 border border-orchid/30 flex items-center justify-center text-lavender text-xs font-medium">
                      {createdBy.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-mist text-sm font-medium">{createdBy.name}</p>
                    <p className="text-fog/40 text-xs">{createdBy.email}</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </>
      )}
    </div>
  )
}

export default EventAboutTab