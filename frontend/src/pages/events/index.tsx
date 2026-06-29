import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'

import EventGrid from '../../components/events/EventGrid'
import Header from '../../components/Header'
import { Error } from '../../components/Error'

import { useDebounce } from '../../hooks/useDebounceValue'
import { useEventsInfiniteQuery } from '../../hooks/useEvents'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'

const Events = () => {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    error,
  } = useEventsInfiniteQuery(debouncedSearch)

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const sentinelRef = useIntersectionObserver(handleLoadMore, {
    rootMargin: '200px',
  })

  const events = data?.pages.flatMap((page) => page.events) ?? []

  const handleRetry = async () => {
    await toast.promise(refetch(), {
      loading: 'Reloading events...',
      success: 'Events loaded successfully',
      error: 'Failed to load events',
    })
  }

  if (error) return <Error text={"Failed to load events"} handleRetry={handleRetry} />

  return (
    <div className="min-h-screen bg-forest-teal/50 relative">
      <Header
        title="Events"
        search={search}
        onChange={setSearch}
        url="/events/create"
      />

      <EventGrid
        events={events}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={!!hasNextPage}
        search={search}
        sentinelRef={sentinelRef}
      />
    </div>
  )
}

export default Events