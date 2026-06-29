import { useEffect, useRef, useState } from 'react'
import {
  UserPlus,
  X,
  Crown,
  Mic,
  ClipboardList,
  HeartHandshake,
  ChevronDown,
  Check,
  Mail,
  Shield,
  Calendar,
  Loader2,
  Trash2,
} from 'lucide-react'
import toast from 'react-hot-toast'

import { useEventContext } from '../../context/eventContext'
import { useMembersQuery } from '../../hooks/useMembership'
import {
  useAddEventMemberMutation,
  useRemoveEventMemberMutation,
  useUpdateEventMemberMutation,
} from '../../hooks/useEvents'
import { EVENT_MEMBER_ROLES, type EventMember, type EventMemberRole } from '../../types'

const ROLE_ICONS: Record<EventMemberRole, typeof Crown> = {
  HOST: Crown,
  SPEAKER: Mic,
  COORDINATOR: ClipboardList,
  VOLUNTEER: HeartHandshake,
}

const formatRole = (role: string) =>
  role.charAt(0) + role.slice(1).toLowerCase()

const EventMemberProfileDialog = ({
  member,
  onClose,
}: {
  member: EventMember
  onClose: () => void
}) => {
  const { event } = useEventContext()
  const RoleIcon = ROLE_ICONS[member.role]

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
            src={event.imageUrl || '/image_holder.jpg'}
            alt="Event banner"
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
          <div className="flex items-start justify-between gap-3 mb-4">
            <h3 className="text-lg font-semibold text-mist leading-tight">
              {member.user?.name ?? '—'}
            </h3>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium border px-2.5 py-1 rounded-full shrink-0 text-fog/80 bg-stone/10 border-stone/40">
              <RoleIcon className="w-3.5 h-3.5" />
              {formatRole(member.role)}
            </span>
          </div>

          <div className="space-y-3">
            {member.user?.email && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-stone/20 shrink-0">
                  <Mail className="w-4 h-4 text-lavender" />
                </div>
                <span className="text-fog/80 truncate">{member.user.email}</span>
              </div>
            )}

            {member.user.createdAt && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-stone/20 shrink-0">
                  <Shield className="w-4 h-4 text-lavender" />
                </div>
                <span className="text-fog/80 border-2 rounded-full border-lavender px-2 py-1">
                  Added to team{' '}
                  {new Date(member.user.createdAt).toLocaleDateString('en-IN', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}

            {member.user?.createdAt && (
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-stone/20 shrink-0">
                  <Calendar className="w-4 h-4 text-lavender" />
                </div>
                <span className="text-fog/80">
                  Member since{' '}
                  {new Date(member.user.createdAt).toLocaleDateString('en-IN', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


export const EventTeam = () => {
  const { event, isCreator, isCommunityAdmin, isEventTeam } = useEventContext()
  const [showAddPanel, setShowAddPanel] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedRole, setSelectedRole] = useState<EventMemberRole>('COORDINATOR')
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  const [profileMember, setProfileMember] = useState<EventMember | null>(null)
  const [confirmRemove, setConfirmRemove] = useState<EventMember | null>(null)

  const canManageTeam = isCreator || isCommunityAdmin || isEventTeam

  const teamMembers = event.members ?? []
  const teamUserIds = new Set(teamMembers.map((m) => m.userId))

  const { data: communityMembers = [], isLoading: loadingCommunity } =
    useMembersQuery(event.communityId)

  const candidates = communityMembers.filter((m) => !teamUserIds.has(m.userId))

  const addMutation = useAddEventMemberMutation()
  const removeMutation = useRemoveEventMemberMutation()
  const updateMutation = useUpdateEventMemberMutation()

  const handleAdd = () => {
    if (!selectedUserId) return
    addMutation.mutate(
      { eventId: event.id, userId: selectedUserId, role: selectedRole },
      {
        onSuccess: () => {
          setSelectedUserId('')
          setShowAddPanel(false)
        },
      },
    )
  }

  const handleRemove = async (memberId: string) => {
    try {
      await toast.promise(
        removeMutation.mutateAsync({ eventId: event.id, memberId }),
        {
          loading: 'Removing member…',
          success: 'Member removed successfully!',
          error: 'Failed to remove member.',
        },
      )
      setConfirmRemove(null)
    } catch {
      // toast already surfaced the error — keep the dialog open so they can retry
    }
  }

  const handleRoleChange = async (memberId: string, role: EventMemberRole) => {
    await toast.promise(
      updateMutation.mutateAsync({ eventId: event.id, memberId, role }),
      {
        loading: 'Updating role…',
        success: 'Role updated!',
        error: 'Failed to update role.',
      },
    )
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedCandidate = candidates.find((c) => c.userId === selectedUserId)

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm tracking-widest uppercase text-fog">
          Event Team ({teamMembers.length})
        </h2>

        {canManageTeam && (
          <button
            onClick={() => setShowAddPanel((s) => !s)}
            className="flex items-center gap-1.5 text-sm text-lavender hover:text-lavender/80 bg-lavender/10 hover:bg-lavender/20 px-3 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Add member
          </button>
        )}
      </div>

      {/* Add panel */}
      {canManageTeam && showAddPanel && (
        <div className="bg-lavender/10 border border-orchid/40 rounded-xl p-4 space-y-3">
          {loadingCommunity ? (
            <p className="text-sm text-fog">Loading community members…</p>
          ) : candidates.length === 0 ? (
            <p className="text-sm text-fog">
              Everyone in the community is already on the team.
            </p>
          ) : (
            <>
              <div className="flex gap-2">
                <div ref={pickerRef} className="relative flex-1">
                  <button
                    type="button"
                    onClick={() => setIsPickerOpen((s) => !s)}
                    className="w-full flex items-center justify-between gap-2 bg-night/40 border border-stone/50 rounded-lg px-3 py-2 text-sm text-white"
                  >
                    {selectedCandidate ? (
                      <span className="flex items-center gap-2 truncate">
                        <img
                          src={selectedCandidate.user?.imageUrl || '/avatar_holder.jpg'}
                          alt=""
                          className="w-5 h-5 rounded-full object-cover shrink-0"
                        />
                        <span className="truncate">{selectedCandidate.user?.name}</span>
                        <span className="text-fog text-xs truncate">
                          {selectedCandidate.user?.email}
                        </span>
                      </span>
                    ) : (
                      <span className="text-fog">Select a person…</span>
                    )}
                    <ChevronDown className="w-4 h-4 text-fog shrink-0" />
                  </button>

                  {isPickerOpen && (
                    <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-night border border-stone/50 rounded-lg shadow-lg">
                      {candidates.map((c) => (
                        <button
                          key={c.userId}
                          type="button"
                          onClick={() => {
                            setSelectedUserId(c.userId)
                            setIsPickerOpen(false)
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-white hover:bg-lavender/10"
                        >
                          <img
                            src={c.user?.imageUrl || '/avatar_holder.jpg'}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                          <span className="flex flex-col truncate">
                            <span className="truncate">{c.user?.name}</span>
                            <span className="text-fog text-xs truncate">{c.user?.email}</span>
                          </span>
                          {c.userId === selectedUserId && (
                            <Check className="w-4 h-4 text-lavender ml-auto shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as EventMemberRole)}
                  className="bg-night/40 border border-stone/50 rounded-lg px-3 py-2 text-sm text-white"
                >
                  {EVENT_MEMBER_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {formatRole(r)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAdd}
                disabled={!selectedUserId || addMutation.isPending}
                className="text-sm bg-lavender text-night px-4 py-2 rounded-lg disabled:opacity-50 cursor-pointer"
              >
                {addMutation.isPending ? 'Adding…' : 'Add to team'}
              </button>
            </>
          )}
        </div>
      )}

      {/* Current team list */}
      <div className="space-y-2">
        {teamMembers.map((member) => {
          const RoleIcon = ROLE_ICONS[member.role]
          const isCreatorRow = event.createdById === member.userId

          const isUpdatingThisRow =
            updateMutation.isPending &&
            updateMutation.variables?.memberId === member.id

          return (
            <div
              key={member.id}
              className="flex items-center justify-between gap-3 bg-night/30 border border-stone/30 rounded-xl px-4 py-3 transition-colors hover:border-stone/50"
            >
              {/* Avatar + info — clickable, opens profile dialog */}
              <button
                type="button"
                onClick={() => setProfileMember(member)}
                className="flex items-center gap-3 min-w-0 text-left cursor-pointer group"
                title="View profile"
              >
                <img
                  src={member.user?.imageUrl || '/avatar_holder.jpg'}
                  alt={member.user?.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-stone/30 group-hover:ring-lavender/50 transition-colors"
                />
                <div className="min-w-0">
                  <p className="text-sm text-white font-medium truncate group-hover:text-lavender transition-colors">
                    {member.user?.name}
                  </p>
                  <p className="text-xs text-fog truncate">{member.user?.email}</p>
                </div>
              </button>

              <div className="flex items-center gap-2 shrink-0">
                {canManageTeam && !isCreatorRow ? (
                  <div className="relative">
                    <select
                      value={member.role}
                      disabled={isUpdatingThisRow}
                      onChange={(e) =>
                        handleRoleChange(member.id, e.target.value as EventMemberRole)
                      }
                      className="appearance-none bg-stone/20 hover:bg-stone/30 text-fog text-xs tracking-wide rounded-full pl-7 pr-7 py-1.5 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-wait focus:outline-none focus:ring-1 focus:ring-lavender"
                    >
                      {EVENT_MEMBER_ROLES.map((r) => (
                        <option key={r} value={r} className="bg-night text-white">
                          {formatRole(r)}
                        </option>
                      ))}
                    </select>
                    <RoleIcon className="w-3.5 h-3.5 text-fog absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <ChevronDown className="w-3 h-3 text-fog absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                ) : (
                  <span className="flex items-center gap-1.5 bg-stone/20 text-fog text-xs tracking-wide rounded-full px-3 py-1.5">
                    <RoleIcon className="w-3.5 h-3.5" />
                    {formatRole(member.role)}
                  </span>
                )}

                {canManageTeam && !isCreatorRow && (
                  <button
                    onClick={() => setConfirmRemove(member)}
                    title="Remove from team"
                    className="p-2 text-fog/40 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10 cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Profile dialog */}
      {profileMember && (
        <EventMemberProfileDialog
          member={profileMember}
          onClose={() => setProfileMember(null)}
        />
      )}

      {/* Remove confirmation */}
      {confirmRemove && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-[#0e2030] border border-stone/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-base font-semibold text-mist mb-2">Remove from team?</h3>
            <p className="text-fog/70 text-sm mb-6 leading-relaxed">
              <span className="text-mist font-medium">{confirmRemove.user?.name}</span> will
              be removed from the event team.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmRemove(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone/30 text-fog/80 text-sm hover:bg-stone/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemove(confirmRemove.id)}
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

export default EventTeam;