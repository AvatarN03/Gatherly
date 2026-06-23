import { MapPin, Calendar, CheckCircle, Loader2, LogOut, Tag, Clock, X, ShieldCheck } from 'lucide-react'

import { useCommunityContext } from '../../context/communityContext';


import type { Community } from '../../types'
import { ROLE_CONFIG } from '../../constant'

type Props = {
  community: Community
  joinPending: boolean
  leavePending: boolean
  withdrawPending: boolean
  onJoin: () => void
  onLeave: () => void
  onWithdraw: () => void
}

const CommunityHero = ({
  community, 
  joinPending, leavePending, withdrawPending,
  onJoin, onLeave, onWithdraw,
}: Props) => {
  const { userMembership, isCreator, userRequest } = useCommunityContext()
  const role          = userMembership?.role;
  const requestStatus = userRequest?.status;

  const renderActions = () => {

    if (userMembership) {
      const roleConfig = ROLE_CONFIG[role ?? 'MEMBER'] ?? ROLE_CONFIG['MEMBER']

      return (
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`flex items-center gap-1.5 text-xs font-medium border px-3 py-1.5 rounded-lg ${roleConfig.className}`}>
            {role === 'OWNER' || role === 'ADMIN'
              ? <ShieldCheck className="w-3.5 h-3.5" />
              : <CheckCircle className="w-3.5 h-3.5" />
            }
            {roleConfig.label}
          </span>

         
          {!isCreator && role === 'MEMBER' && (
            <button
              onClick={onLeave}
              disabled={leavePending}
              className="flex items-center gap-2 bg-[#182F3D] hover:bg-red-500/10 border border-[#70787A33] hover:border-red-500/30 text-[#70787A] hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm px-4 py-2 rounded-lg transition-all"
            >
              {leavePending
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Leaving...</>
                : <><LogOut className="w-3.5 h-3.5" /> Leave</>
              }
            </button>
          )}
        </div>
      )
    }

    // ── 2. Request pending ────────────────────────────────────
    if (requestStatus === 'PENDING') return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-lg">
          <Clock className="w-3.5 h-3.5" />
          Pending Approval
        </span>
        <button
          onClick={onWithdraw}
          disabled={withdrawPending}
          className="flex items-center gap-2 bg-[#182F3D] hover:bg-red-500/10 border border-[#70787A33] hover:border-red-500/30 text-[#70787A] hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm px-4 py-2 rounded-lg transition-all"
        >
          {withdrawPending
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Withdrawing...</>
            : <><X className="w-3.5 h-3.5" /> Withdraw Request</>
          }
        </button>
      </div>
    )

    // ── 3. Request rejected ───────────────────────────────────
    if (requestStatus === 'REJECTED') return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="flex items-center gap-1.5 text-xs font-medium text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-1.5 rounded-lg">
          <X className="w-3.5 h-3.5" />
          Request Rejected
        </span>
        <button
          onClick={onJoin}
          disabled={joinPending}
          className="flex items-center gap-2 bg-[#182F3D] hover:bg-[#A855F7]/10 border border-[#70787A33] hover:border-[#A855F7]/30 text-[#70787A] hover:text-[#A855F7] text-sm px-4 py-2 rounded-lg transition-all"
        >
          {joinPending
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Requesting...</>
            : 'Request Again'
          }
        </button>
      </div>
    )

    // ── 4. No membership, no request → can join ───────────────
    return (
      <button
        onClick={onJoin}
        disabled={joinPending}
        className="flex items-center gap-2 bg-[#A855F7] hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors cursor-pointer"
      >
        {joinPending
          ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Requesting...</>
          : 'Join Community'
        }
      </button>
    )
  }

  return (
    <div className="relative rounded-2xl border border-stone/30 bg-deep-ocean overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/25 via-transparent to-transparent pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row gap-6 p-6">
        <div className="flex-1 flex flex-col justify-between gap-4">

          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-lavender bg-fog/10 border border-mist/20 px-2.5 py-1 rounded-full mb-3">
              <Tag className="w-3 h-3" />
              {community.category}
            </span>
            <h1 className="text-2xl font-semibold text-mist leading-tight">{community.name}</h1>
            <p className="text-fog text-sm mt-2 leading-relaxed max-w-3xl">{community.description}</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-1.5 text-xs text-lavender rounded-lg px-3 py-1.5 bg-lavender/10 border border-lavender/20">
              <MapPin className="w-3.5 h-3.5 text-fog" />
              {community.location}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-lavender rounded-lg px-3 py-1.5 bg-lavender/10 border border-lavender/20">
              <Calendar className="w-3.5 h-3.5 text-lavender" />
              Since {new Date(community.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {renderActions()}
          </div>
        </div>

        <div className="md:w-72 md:h-fit sm:w-48 sm:h-48 w-full h-52 shrink-0 rounded-xl overflow-hidden border border-[#182F3D]">
          <img
            src={community.imageUrl || '/image_holder.jpg'}
            alt={community.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export default CommunityHero