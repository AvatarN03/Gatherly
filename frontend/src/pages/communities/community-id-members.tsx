import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUser } from '@clerk/react'
import {
  Users, Search, Trash2, Loader2, ChevronDown,
  X, Mail, Calendar, Shield,
} from 'lucide-react'

import { Badge } from '../../components/Badge'

import { useCommunityContext } from '../../context/communityContext'

import { useMembersQuery, useRemoveMemberMutation, useUpdateMemberRoleMutation } from '../../hooks/useMembership'

import type { Membership, Role } from '../../types'
import { ROLE_CONFIG } from '../../constant'





const RoleDropdown = ({
  member, isOwner, currentUserId, onRoleChange, isPending,
}: {
  member: Membership
  isOwner: boolean
  currentUserId: string
  onRoleChange: (memberId: string, role: 'ADMIN' | 'MEMBER') => void
  isPending: boolean
}) => {
  const [open, setOpen] = useState(false)
  const isSelf = member.userId === currentUserId
  const isTarget = member.role === 'OWNER'

  if (isSelf || (isTarget && !isOwner)) return <Badge
    config={ROLE_CONFIG[member.role as Role] ?? ROLE_CONFIG.MEMBER}
  />

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 text-xs font-medium border px-2.5 py-1 rounded-full transition-colors cursor-pointer disabled:opacity-50 text-fog/80 bg-stone/10 border-stone/40 hover:border-lavender/50 hover:text-lavender cursor-pointer disabled:cursor-not-allowed"
      >
        {isPending
          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
          : <>{ROLE_CONFIG[member.role as Role]?.label ?? member.role} <ChevronDown className="w-3.5 h-3.5" /></>
        }
      </button>

      {open && (
        <div className="absolute right-0 top-7 z-50 bg-[#0e2030] border border-stone/40 rounded-xl shadow-2xl overflow-hidden min-w-[130px]">
          {(['ADMIN', 'MEMBER'] as const).map((role) => {
            const { label, icon: Icon, className } = ROLE_CONFIG[role]
            return (
              <button
                key={role}
                onClick={() => { onRoleChange(member.id, role); setOpen(false) }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm transition-colors hover:bg-stone/20 ${member.role === role ? 'opacity-40 cursor-default' : 'cursor-pointer'
                  }`}
              >
                <span className={`inline-flex items-center gap-1.5 border px-2 py-0.5 rounded-full text-xs ${className}`}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}


const MemberProfileDialog = ({
  member,
  onClose,
}: {
  member: Membership
  onClose: () => void
}) => {
  const { label, icon: Icon, className } = ROLE_CONFIG[member.role as Role] ?? ROLE_CONFIG.MEMBER;

  const { community } = useCommunityContext();

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-deep-ocean border border-stone/40 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top banner + avatar */}
        <div className="relative">
          <img
            src={community?.imageUrl || '/image-holder.jpg'}
            alt="Community Banner"
            className="w-full h-32 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 bg-black/30 hover:bg-black/50 rounded-full text-fog/70 hover:text-mist border border-stone/40 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute -bottom-8 left-6 border-2 border-orchid rounded-2xl shadow-lg bg-black/20">
            {member.user?.imageUrl ? (
              <img
                src={member.user.imageUrl}
                alt={member.user.name}
                className="w-16 h-16 rounded-2xl object-cover border-4 border-[#0e2030] shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-orchid/30 border-4 border-[#0e2030] flex items-center justify-center text-lavender font-bold text-2xl shadow-lg">
                {member.user?.name?.charAt(0).toUpperCase() ?? '?'}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="pt-12 px-6 pb-6">
          {/* Name + role */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-mist leading-tight">
                {member.user?.name ?? '—'}
              </h3>
            </div>
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium border px-2.5 py-1 rounded-full shrink-0 ${className}`}>
              <Icon className="w-3.5 h-3.5" />
              {label}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-3">
            {member.user?.email && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-stone/20 shrink-0">
                  <Mail className="w-4 h-4 text-lavender" />
                </div>
                <span className="text-fog/80 truncate">{member.user.email}</span>
              </div>
            )}



            <div className="flex items-center gap-3 text-sm">
              <div className="p-2 rounded-lg bg-stone/20 shrink-0">
                <Shield className="w-4 h-4 text-lavender" />
              </div>
              <span className="text-fog/80 border-2 rounded-full border-lavender px-2 py-1">Joined community {new Date(member.createdAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>

            {member.user.createdAt && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-stone/20 shrink-0">
                  <Calendar className="w-4 h-4 text-lavender" />
                </div>
                <span className="text-fog/80">
                  Member since {new Date(member.user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


export const CommunityMembersPanel = () => {
  const { id } = useParams<{ id: string }>();
  const { user: clerkUser } = useUser();
  const { isAdmin, isOwner, isCreator } = useCommunityContext();

  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState<Role | 'ALL'>('ALL')

  const [confirmRemove, setConfirmRemove] = useState<Membership | null>(null)
  const [profileMember, setProfileMember] = useState<Membership | null>(null)

  const { data: members = [], isLoading } = useMembersQuery(id || '')
  const roleMutation = useUpdateMemberRoleMutation()
  const removeMutation = useRemoveMemberMutation();

  const canManage = isAdmin || isOwner || isCreator

  const filtered = members.filter((m) => {
    const matchesSearch =
      m.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.user?.email?.toLowerCase().includes(search.toLowerCase())
    const matchesRole = filterRole === 'ALL' || m.role === filterRole
    return matchesSearch && matchesRole
  })

  const handleRoleChange = (memberId: string, role: 'ADMIN' | 'MEMBER') =>
    roleMutation.mutate({ communityId: id!, memberId, role })

  const handleRemove = (member: Membership) =>
    removeMutation.mutate(
      { communityId: id!, memberId: member.id },
      { onSuccess: () => setConfirmRemove(null) }
    )

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-lavender" />
          <h2 className="text-xl font-semibold text-mist">Members</h2>
          <span className="text-xs font-medium text-night bg-lavender px-2.5 py-0.5 rounded-full">
            {members.length}
          </span>
        </div>

        {/* Role filter */}
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
            const isSelf = member.userId === clerkUser?.id
            const isTarget = member.role === 'OWNER'

            return (
              <div
                key={member.id}
                className="flex flex-col md:flex-row md:items-center gap-4 bg-deep-ocean/70 border border-stone/25 rounded-xl px-4 py-3.5 hover:border-stone/50 hover:bg-deep-ocean/90 transition-all"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Avatar — clickable to open profile */}
                  <button
                    onClick={() => setProfileMember(member)}
                    className="relative shrink-0 cursor-pointer group"
                    title="View profile"
                  >
                    {member.user?.imageUrl ? (
                      <img
                        src={member.user.imageUrl}
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

                  {/* Info — also clickable */}
                  <button
                    onClick={() => setProfileMember(member)}
                    className="flex-1 min-w-0 text-left cursor-pointer"
                  >
                    <p className="text-sm font-semibold text-mist truncate group-hover:text-lavender transition-colors">
                      {member.user?.name ?? '—'}
                    </p>
                    <p className="text-xs text-fog/60 truncate mt-0.5">{member.user?.email ?? '—'}</p>
                  </button>

                  {/* Joined date */}
                  <span className="hidden md:block text-xs text-fog/50 shrink-0">
                    {new Date(member.createdAt).toLocaleDateString('en-IN', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </span>

                  {/* Role */}
                  <div className="shrink-0">
                    {canManage && !isTarget ? (
                      <RoleDropdown
                        member={member}
                        isOwner={isOwner}
                        currentUserId={clerkUser?.id ?? ''}
                        onRoleChange={handleRoleChange}
                        isPending={roleMutation.isPending && roleMutation.variables?.memberId === member.id}
                      />
                    ) : (
                      <Badge
                        config={ROLE_CONFIG[member.role as Role] ?? ROLE_CONFIG.MEMBER}
                      />
                    )}
                  </div>

                  {/* Remove action */}
                  {canManage && !isSelf && !isTarget && (
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

      {/* Profile dialog */}
      {profileMember && (
        <MemberProfileDialog
          member={profileMember}
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
                {removeMutation.isPending
                  ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Removing...</>
                  : 'Remove'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}