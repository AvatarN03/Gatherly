import { useCallback, useState } from 'react'

import toast from 'react-hot-toast'

import CommunityGrid from '../../components/communities/CommunityGrid'

import { useDebounce } from '../../hooks/useDebounceValue'
import { useCommunitiesInfiniteQuery } from '../../hooks/useCommunities'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import Header from '../../components/Header'
import { Error } from '../../components/Error'


const Communities = () => {
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
  } = useCommunitiesInfiniteQuery(debouncedSearch)

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const sentinelRef = useIntersectionObserver(handleLoadMore, {
    rootMargin: '200px',
  })

  const communities = data?.pages.flatMap((page) => page.communities) ?? []

  const handleRetry = async () => {
    await toast.promise(
      refetch(),
      {
        loading: 'Reloading communities...',
        success: 'Communities loaded successfully',
        error: 'Failed to load communities',
      }
    )
  }




  if (error) return <Error text={"Failed to load communities"} handleRetry={handleRetry} />

  return (
    <div className="min-h-screen bg-forest-teal/50 relative">
      <Header
      title="Communities"
      search={search} 
      onChange={setSearch} 
      url="/communities/create" 
      />


      <CommunityGrid
        communities={communities}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={!!hasNextPage}
        search={search}
        sentinelRef={sentinelRef}
      />
    </div>
  )
}

export default Communities