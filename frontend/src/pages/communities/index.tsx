import { useCallback, useState } from 'react'

import { AlertTriangle, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

import CommunityGrid from '../../components/communities/CommunityGrid'

import { useDebounce } from '../../hooks/useDebounceValue'
import { useCommunitiesInfiniteQuery } from '../../hooks/useCommunities'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import Header from '../../components/Header'


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




  if (error) return (
    <div className=" bg-night/50 flex items-start justify-center py-20 md:px-4">
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="p-4 bg-red-500/10 rounded-3xl flex items-center justify-between gap-3 w-full">
          <AlertTriangle className="w-64 h-64 text-red-400" />
          <div className="flex flex-col  text-right gap-8">
            <p className="text-lavender text-4xl font-medium mb-1">Something went wrong</p>
            <p className="text-fog text-xl">Failed to load communities</p>
          </div>
        </div>
        <button
          onClick={handleRetry}
          className="flex items-center gap-2 px-4 py-2 bg-slate hover:bg-slate-800 border border-purple-900 hover:border-purple-400 text-mist text-base rounded-lg transition-all cursor-pointer"
        >
          <RefreshCw className="w-9 h-9" />
          Try again
        </button>
      </div>
    </div>
  )

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