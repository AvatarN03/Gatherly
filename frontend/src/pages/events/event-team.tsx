import { useEffect, useMemo, useRef, useState } from 'react'
import {
  UserPlus,
  ChevronDown,
  Check,
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
import { Badge } from '../../components/Badge'
import { EVENT_ROLE_BADGES } from '../../constant'
import { MemberProfileDialog } from '../../components/MemberDialog'
import ConfirmModal from '../../components/communities/ConfirmModal'



export const EventTeam = () => {
  const { event, isCreator, isCoordinator } = useEventContext();

  const [showAddPanel, setShowAddPanel] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedRole, setSelectedRole] = useState<EventMemberRole>('VOLUNTEER');
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null);

  const canManageTeam = isCreator || isCoordinator;

  const [profileMember, setProfileMember] = useState<EventMember | null>(null)
  const [confirmRemove, setConfirmRemove] = useState<EventMember | null>(null)

  const teamMembers = event.members

  const { data: communityMembers = [], isLoading: loadingCommunity } =
    useMembersQuery(event.communityId)

  const teamUserIds = useMemo(
    () => new Set(teamMembers.map(m => m.user.id)),
    [teamMembers]
  )

  const candidates = useMemo(
    () =>
      communityMembers.filter(
        m => !teamUserIds.has(m.user.id)
      ),
    [communityMembers, teamUserIds]
  )

  const addMutation = useAddEventMemberMutation();
  const removeMutation = useRemoveEventMemberMutation();
  const updateMutation = useUpdateEventMemberMutation();

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
          error: "Failed to remove member. Please try again.",
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

  //TODO: shift the add memeber code  

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedCandidate = candidates.find((c) => c.user.id === selectedUserId)

  return (
    <div className="p-4 space-y-4 max-w-5xl mx-auto">
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
                          src={selectedCandidate.user.imageUrl || '/avatar_holder.jpg'}
                          alt=""
                          className="w-5 h-5 rounded-full object-cover shrink-0"
                        />
                        <span className="truncate">{selectedCandidate.user.name}</span>
                        <span className="text-fog text-xs truncate">
                          {selectedCandidate.user.email}
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
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setSelectedUserId(c.user.id)
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
                    <option key={r} value={r} className="bg-night text-white">
                      {EVENT_ROLE_BADGES[r].label}
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
          const isCreatorRow = event.createdById === member.user.id
          const canManageMember = canManageTeam && !isCreatorRow

          const isUpdatingThisRow =
            updateMutation.isPending &&
            updateMutation.variables?.memberId === member.id

          return (
            <div
              key={member.id}
              className="flex items-center justify-between gap-3 bg-night/30 border border-stone/30 rounded-xl px-4 py-3 transition-colors hover:border-stone/50 cursor-pointer hover:bg-night/40"
              onClick={() => setProfileMember(member)}
              title="View profile"
            >
              {/* Avatar + info — clickable, opens profile dialog */}
              <div
                className="flex items-center gap-3 min-w-0 text-left cursor-pointer group"

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
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {canManageMember ? (
                  <div
                    className="relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      value={member.role}
                      disabled={isUpdatingThisRow}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleRoleChange(
                          member.id,
                          e.target.value as EventMemberRole
                        );
                      }}
                      className="appearance-none bg-stone/20 hover:bg-stone/30 text-fog text-xs rounded-full px-3 pr-7 py-1.5 cursor-pointer"
                    >
                      {EVENT_MEMBER_ROLES.map((r) => (
                        <option
                          key={r}
                          value={r}
                          className="bg-night text-white"
                        >
                          {EVENT_ROLE_BADGES[r].label}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                ) : (
                  <Badge
                    config={EVENT_ROLE_BADGES[member.role]}
                    size="sm"
                  />
                )}

                {canManageMember && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmRemove(member)
                    }}
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
        <MemberProfileDialog
          type="event"
          member={profileMember}
          image={event.imageUrl}
          onClose={() => setProfileMember(null)}
        />
      )}

      <ConfirmModal
        isOpen={!!confirmRemove}
        onClose={() => setConfirmRemove(null)}
        onConfirm={() =>
          confirmRemove
            ? handleRemove(confirmRemove.id)
            : Promise.resolve()
        }
        isPending={removeMutation.isPending}
        title="Remove Member"
        description={
          confirmRemove
            ? `${confirmRemove.user.name} will be removed from the event team.`
            : ""
        }
        confirmButtonLabel="Remove"
      />
    </div>
  )
}

export default EventTeam;