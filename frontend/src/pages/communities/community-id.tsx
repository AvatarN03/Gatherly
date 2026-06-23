import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { LayoutGrid, CalendarDays } from 'lucide-react'

import CommunityHero from '../../components/communities/communityHero'
import CommunityStats from '../../components/communities/communityStats'
import OverviewTab from '../../components/communities/overViewTabs'
import EventsTab from '../../components/communities/EventsTab'

import {
  useJoinCommunityMutation,
  useLeaveCommunityMutation,
  useWithdrawRequestMutation,
} from '../../hooks/useMembership'

import { useCommunityContext } from '../../context/communityContext'



const CommunityDetail = () => {
  const { id } = useParams<{ id: string }>()

  const { community } = useCommunityContext();

  const [activeTab, setActiveTab] = useState<'overview' | 'events'>('overview')


  const joinMutation = useJoinCommunityMutation();
  const leaveMutation = useLeaveCommunityMutation();
  const withdrawMutation = useWithdrawRequestMutation();


  return (
    <div className="bg-night/40">

      <div
        className="px-4 py-6 relative overflow-hidden rounded-b-2xl"
        style={{
          backgroundImage: `url(${community.imageUrl || '/image_holder.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 w-full h-full bg-black/50 backdrop-blur-xs" />

        <div className="relative z-30 space-y-4">
          <CommunityHero
            community={community}
            joinPending={joinMutation.isPending}
            leavePending={leaveMutation.isPending}
            withdrawPending={withdrawMutation.isPending}
            onJoin={() => joinMutation.mutate(id!)}
            onLeave={() => leaveMutation.mutate(id!)}
            onWithdraw={() => withdrawMutation.mutate(id!)}
          />

          <CommunityStats
            memberCount={community?._count?.members ?? 0}
            eventCount={community?.events?.length ?? 0}
            requestCount={community?._count?.requests ?? 0}
          />

          <div className="bg-lavender/75 border-4 border-cocoa rounded-xl overflow-hidden">
            <div className="flex border-b border-orchid">

              <button

                onClick={() => setActiveTab("overview")}
                className={`relative flex items-center gap-2 px-5 py-3.5 text-xs cursor-pointer tracking-widest capitalize transition-colors text-night w-full justify-center
                    ${activeTab === "overview"
                    ? 'font-bold bg-cocoa/35 border-b-2 border-deep-ocean'
                    : 'hover:text-fog hover:bg-slate'
                  }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Overview
              </button>
              <button

                onClick={() => setActiveTab("events")}
                className={`relative flex items-center justify-center gap-2 px-5 py-3.5 text-xs cursor-pointer tracking-widest capitalize transition-colors text-night w-full 
                    ${activeTab === "events"
                    ? 'font-bold bg-cocoa/35 border-b-2 border-deep-ocean'
                    : 'hover:text-fog hover:bg-slate'
                  }`}
              >
                <CalendarDays className="w-4 h-4" />
                Events
              </button>

            </div>

            <div className="p-5">
              {activeTab === 'overview' && <OverviewTab community={community} />}
              {activeTab === 'events' && <EventsTab events={community.events ?? []} />}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default CommunityDetail