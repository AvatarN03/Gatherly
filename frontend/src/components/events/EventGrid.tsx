import Card from '../Card'

import { SKELETON_COUNT } from '../../constant'
import type { EventGridType } from '../../types'
import { CardSkeleton } from '../Skeleton'

const EventGrid = ({
  events,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  search,
  sentinelRef,
}: EventGridType) => {
  return (
    <div className="px-2 md:px-6 pt-6 pb-10">

      {/* Section label */}
      <div className="flex items-center gap-3 mb-4">
        <p className="text-mist text-xs uppercase tracking-widest font-medium underline decoration-wavy decoration-cocoa/80 decoration-2 underline-offset-4">
          {search ? `Results for "${search}"` : 'All Events'}
        </p>
        {!isLoading && events.length > 0 && (
          <span className="text-lavender text-sm bg-orchid/10 border border-purple-800 px-2 py-0.5 rounded-full">
            {events.length}{hasNextPage ? '+' : ''} events
          </span>
        )}
      </div>

      {/* Grid — skeletons on initial load, cards otherwise */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <CardSkeleton key={i} />
            ))
          : events.map((event) => (
              <Card key={event.id} type="event" item={event} />
            ))
        }

        {/* Append skeletons at the end of existing cards while fetching next page */}
        {isFetchingNextPage &&
          Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={`next-${i}`} />
          ))
        }
      </div>

      {/* Empty state */}
      {!isLoading && events.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lavender text-4xl mb-1">No events found</p>
          <p className="text-fog text-xl my-4 font-light">
            {search ? 'Try a different search term' : 'Be the first to create one'}
          </p>
        </div>
      )}

      {/* Sentinel */}
      <div ref={sentinelRef} className="h-4" />

      {!hasNextPage && events.length > 0 && (
        <div className="text-center py-6 text-stone text-xs tracking-wide">
          — you've seen all events —
        </div>
      )}
    </div>
  )
}

export default EventGrid