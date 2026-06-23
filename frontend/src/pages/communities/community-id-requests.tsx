import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  ClipboardList, Check, X, Clock, Search,
  Loader2, FileText, ExternalLink
} from 'lucide-react'

import { Badge } from '../../components/Badge';

import { useCommunityContext } from '../../context/communityContext';

import { useCommunityRequestsQuery, useHandleRequestMutation } from '../../hooks/useMembership'

import type { MembershipRequest, StatusFilter } from '../../types'
import { STATUS_CONFIG } from '../../constant'



export const CommunityRequestPanel = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin, isOwner } = useCommunityContext();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('PENDING');

  const { data: requests = [], isLoading } = useCommunityRequestsQuery(id || '', isAdmin || isOwner)

  const handleMutation = useHandleRequestMutation()

  const handleRequest = (requestId: string, status: 'APPROVED' | 'REJECTED') => {
    handleMutation.mutate({ communityId: id!, requestId, status })
  }

  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.user?.email?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;

  if (!isAdmin && !isOwner) return (
    <div className="flex items-center justify-center py-24 text-fog/40 text-sm">
      You don't have permission to view requests.
    </div>
  )

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-mist flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-lavender" />
            Join Requests
            {pendingCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orchid text-[10px] text-white font-bold">
                {pendingCount}
              </span>
            )}
          </h2>
          <p className="text-fog/50 text-sm mt-0.5">{requests.length} total requests</p>
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-2">
          {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                filterStatus === s
                  ? 'bg-orchid/20 border-orchid/40 text-lavender'
                  : 'bg-stone/10 border-stone/30 text-fog/60 hover:border-stone/50'
              }`}
            >
              {s === 'ALL' ? 'All' : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full bg-deep-ocean/60 border border-stone/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-mist placeholder:text-fog/40 focus:outline-none focus:border-orchid/50 transition-colors"
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-fog/40 gap-3 text-sm">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading requests...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="p-4 bg-stone/10 rounded-full">
            <ClipboardList className="w-7 h-7 text-fog/30" />
          </div>
          <p className="text-fog/40 text-sm">
            {filterStatus === 'PENDING' ? 'No pending requests.' : 'No requests match your filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((request: MembershipRequest) => {
            const isActioning =
              handleMutation.isPending &&
              handleMutation.variables?.requestId === request.id

            return (
              <div
                key={request.id}
                className="bg-deep-ocean/60 border border-stone/20 rounded-xl p-4 hover:border-stone/40 transition-colors"
              >
                <div className="flex items-start gap-4">

                  {/* Avatar */}
                  <div className="shrink-0">
                    {request.user?.imageUrl ? (
                      <img
                        src={request.user.imageUrl}
                        alt={request.user.name}
                        className="w-11 h-11 rounded-full object-cover border border-stone/30"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-orchid/20 border border-orchid/30 flex items-center justify-center text-lavender font-semibold">
                        {request.user?.name?.charAt(0).toUpperCase() ?? '?'}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-mist">{request.user?.name ?? '—'}</p>
                      <Badge 
                        config={STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.PENDING}
                      />
                    </div>
                    <p className="text-xs text-fog/50 mt-0.5">{request.user?.email}</p>

                    {/* Requested date */}
                    <p className="text-xs text-fog/40 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Requested {new Date(request.createdAt).toLocaleDateString('in-IN', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </p>

                    {/* Proof URL */}
                    {request.proofUrl && (
                      <a
                        href={request.proofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2 text-xs text-lavender/80 hover:text-lavender bg-lavender/5 hover:bg-lavender/10 border border-lavender/20 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <FileText className="w-3 h-3" />
                        View proof document
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Actions — only for PENDING */}
                  {request.status === 'PENDING' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleRequest(request.id, 'APPROVED')}
                        disabled={isActioning}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        {isActioning && handleMutation.variables?.status === 'APPROVED'
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Check className="w-3.5 h-3.5" />
                        }
                        Approve
                      </button>
                      <button
                        onClick={() => handleRequest(request.id, 'REJECTED')}
                        disabled={isActioning}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        {isActioning && handleMutation.variables?.status === 'REJECTED'
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <X className="w-3.5 h-3.5" />
                        }
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}