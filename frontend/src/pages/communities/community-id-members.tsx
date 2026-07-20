import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Users, Search, Trash2, Loader2 } from 'lucide-react'

import { RoleDropdown } from '../../components/RoleDropdown'
import { MemberProfileDialog } from '../../components/MemberDialog'

import { useCommunityContext } from '../../context/communityContext'

import { useMembersQuery, useRemoveMemberMutation, useUpdateMemberRoleMutation } from '../../hooks/useMembership'

import { formatDate } from '../../lib/date'

import { COMMUNITY_ASSIGNABLE_ROLES, ROLE_CONFIG } from '../../constant'

import type { MemberRoleHandler, Membership, Role } from '../../types'

export const CommunityMembersPanel = () => {
  const { id } = useParams<{ id: string }>()
  const { isAdmin, isCreator, community, userMembership } = useCommunityContext()


  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState<Role | 'ALL'>('ALL')
  const [confirmRemove, setConfirmRemove] = useState<Membership | null>(null)
  const [profileMember, setProfileMember] = useState<Membership | null>(null)

  const { data: members = [], isLoading } = useMembersQuery(id || '')
  const roleMutation = useUpdateMemberRoleMutation()
  const removeMutation = useRemoveMemberMutation()

  // Anyone with isAdmin OR isCreator can manage
  const canManage = isAdmin || isCreator
  const currentUserId = userMembership?.userId ?? ''

  const filtered = useMemo(() => {
    const query = search.toLowerCase()
    return members.filter((member) => {
      const matchesSearch =
        member.user?.name?.toLowerCase().includes(query) ||
        member.user?.email?.toLowerCase().includes(query)
      return matchesSearch && (filterRole === 'ALL' || member.role === filterRole)
    })
  }, [members, search, filterRole])

  const handleRoleChange = (memberId: string, role: MemberRoleHandler) => {
    roleMutation.mutate({ communityId: id!, memberId, role })
  }

  const handleRemove = (member: Membership) => {
    removeMutation.mutate(
      { communityId: id!, memberId: member.id },
      { onSuccess: () => setConfirmRemove(null) }
    )
  }

  const canManageMember = (member: Membership) => {
    if (!canManage) return false
    if (member.user.id === currentUserId) return false // can't touch yourself
    if (member.role === 'OWNER') return false // only creator holds OWNER, never editable
    return true
  }

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-lavender" />
          <h2 className="text-xl font-semibold text-mist">Members</h2>
          <span className="text-xs font-medium text-night bg-lavender px-2.5 py-0.5 rounded-full">
            {members.length}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {(['ALL', 'ADMIN', 'MEMBER'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors cursor-pointer font-medium ${filterRole === r
                ? 'bg-orchid/20 border-orchid/40 text-lavender'
                : 'bg-stone/10 border-stone/30 text-fog/70 hover:border-stone/60 hover:text-fog'
                }`}
            >
              {r === 'ALL' ? 'All' : ROLE_CONFIG[r].label}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full bg-deep-ocean/60 border border-stone/30 rounded-xl pl-11 pr-4 py-3 text-sm text-mist placeholder:text-fog/40 focus:outline-none focus:border-orchid/50 transition-colors"
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-fog/50 gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading members...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="p-4 bg-stone/10 rounded-full">
            <Users className="w-7 h-7 text-fog/30" />
          </div>
          <p className="text-fog/50 text-sm">No members match your search.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((member) => {
            const isSelf = member.user.id === currentUserId
            const isRoleUpdating =
              roleMutation.isPending &&
              roleMutation.variables?.memberId === member.id
            const editable = canManageMember(member)
            return (
              <div
                key={member.id}
                className="flex flex-col md:flex-row md:items-center gap-4 bg-deep-ocean/70 border border-stone/25 rounded-xl px-4 py-3.5 hover:border-stone/50 hover:bg-deep-ocean/90 transition-all"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Avatar */}
                  <button
                    onClick={() => setProfileMember(member)}
                    className="relative shrink-0 cursor-pointer group"
                    title="View profile"
                  >
                    {member.user?.imageUrl ? (
                      <img
                        src={member.user.imageUrl ?? '/default-avatar.png'}
                        alt={member.user.name}
                        className="w-11 h-11 rounded-xl object-cover border border-stone/30 group-hover:border-lavender/50 transition-colors"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-orchid/20 border border-orchid/30 group-hover:border-lavender/50 flex items-center justify-center text-lavender font-bold text-base transition-colors">
                        {member.user?.name?.charAt(0).toUpperCase() ?? '?'}
                      </div>
                    )}
                    {isSelf && (
                      <span className="absolute -bottom-1.5 -right-1.5 text-[9px] bg-orchid text-white px-1.5 py-px rounded-full leading-tight font-medium">
                        you
                      </span>
                    )}
                  </button>

                  {/* Info */}
                  <button
                    onClick={() => setProfileMember(member)}
                    className="flex-1 min-w-0 text-left cursor-pointer group"
                  >
                    <p className="text-sm font-semibold text-mist truncate group-hover:text-lavender transition-colors">
                      {member.user?.name}
                    </p>
                    <p className="text-xs text-fog/60 truncate mt-0.5">
                      {member.user?.email}
                    </p>
                    {/* Show proof indicator if exists */}
                    {member.proofUrl && (
                      <span className="text-[10px] text-lavender/60 mt-1 inline-flex items-center gap-1">
                        <span>✓</span> Verified
                      </span>
                    )}
                  </button>

                  {/* Joined date */}
                  <span className="hidden md:block text-xs text-fog/50 shrink-0">
                    {formatDate(member.createdAt)}
                  </span>

                  {/* Role dropdown or badge */}
                  <div className="shrink-0">
                    <RoleDropdown
                      currentRole={member.role}
                      roleOptions={ROLE_CONFIG}
                      assignableRoles={COMMUNITY_ASSIGNABLE_ROLES}
                      canManage={editable}
                      onRoleChange={(role) => handleRoleChange(member.id, role)} // role: MemberRoleHandler ✓
                      isPending={isRoleUpdating}
                    />
                  </div>

                  {/* Remove button */}
                  {editable && (
                    <button
                      onClick={() => setConfirmRemove(member)}
                      className="p-2 text-fog/40 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10 cursor-pointer shrink-0"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Profile dialog - using reusable component */}
      {profileMember && (
        <MemberProfileDialog
          member={profileMember}
          image={community?.imageUrl}
          onClose={() => setProfileMember(null)}
        />
      )}

      {/* Remove confirmation */}
      {confirmRemove && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-[#0e2030] border border-stone/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-base font-semibold text-mist mb-2">Remove member?</h3>
            <p className="text-fog/70 text-sm mb-6 leading-relaxed">
              <span className="text-mist font-medium">{confirmRemove.user?.name}</span> will be removed and will need to request again to rejoin.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmRemove(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone/30 text-fog/80 text-sm hover:bg-stone/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemove(confirmRemove)}
                disabled={removeMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/20 disabled:opacity-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {removeMutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Removing...
                  </>
                ) : (
                  'Remove'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}