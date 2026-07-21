import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { LayoutGrid, CalendarDays, ClipboardList, Users } from 'lucide-react'

import CommunityHero from '../../components/communities/CommunityHeroo'
import OverviewTab from '../../components/communities/OverViewTab'
import EventsTab from '../../components/communities/EventsTab'
import JoinRequestModal from '../../components/communities/JoinRequestModal'
import ConfirmModal from '../../components/communities/ConfirmModal'

import {
  useJoinCommunityMutation,
  useLeaveCommunityMutation,
  useWithdrawRequestMutation,
} from '../../hooks/useMembership'

import { useCommunityContext } from '../../context/communityContext'
import Stats from '../../components/shared/Stats'

const CommunityDetail = () => {
  const { id } = useParams<{ id: string }>()

  const { community, userMembership } = useCommunityContext();

  const [activeTab, setActiveTab] = useState<'overview' | 'events'>('overview')
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)


  const joinMutation = useJoinCommunityMutation();
  const leaveMutation = useLeaveCommunityMutation();
  const withdrawMutation = useWithdrawRequestMutation();

  const handleJoinSubmit = async (file: File): Promise<void> => {
    joinMutation.mutate(
      { communityId: id!, proofImage: file },
      {
        onSuccess: () => setIsJoinModalOpen(false),
      }
    )
  }

  const handleWithdrawConfirm = () => {
    withdrawMutation.mutate(id!, {
      onSuccess: () => setIsWithdrawModalOpen(false),
    })
  }

  const handleLeaveConfirm = () => {
    leaveMutation.mutate(id!, {
      onSuccess: () => setIsLeaveModalOpen(false),
    })
  }

  const isAdminLeaving = userMembership?.role === 'ADMIN'


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
            onJoin={() => setIsJoinModalOpen(true)}
            onLeave={() => setIsLeaveModalOpen(true)}
            onWithdraw={() => setIsWithdrawModalOpen(true)}
          />

          <Stats
            items={[
              {
                label: 'Members',
                value: community?._count?.members ?? 0,
                icon: Users,
              },
              {
                label: 'Events',
                value: community?.events?.length ?? 0,
                icon: CalendarDays,
              },
              {
                label: 'Requests',
                value: community?._count?.requests ?? 0,
                icon: ClipboardList,
              },
            ]}
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

      <JoinRequestModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSubmit={handleJoinSubmit}
        isPending={joinMutation.isPending}
      />

      <ConfirmModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onConfirm={handleWithdrawConfirm}
        isPending={withdrawMutation.isPending}
        title="Withdraw Request"
        description="Are you sure you want to withdraw your join request? This action cannot be undone."
        warningNote="Your submitted proof image will be permanently deleted from our servers."
        confirmWord="WITHDRAW"
        confirmButtonLabel="Withdraw Request"
      />

      <ConfirmModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onConfirm={handleLeaveConfirm}
        isPending={leaveMutation.isPending}
        title="Leave Community"
        description="Are you sure you want to leave this community?"
        warningNote={
          isAdminLeaving
            ? "You are an Admin. Leaving will remove your admin privileges, any event roles (host/speaker/coordinator) you hold in this community, and your proof image."
            : "Your event registrations and proof image associated with this community will be permanently deleted."
        }
        confirmWord="LEAVE"
        confirmButtonLabel="Leave Community"
      />

    </div>
  )
}

export default CommunityDetail