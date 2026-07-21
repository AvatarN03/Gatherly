import { useCallback, useMemo } from 'react'
import { UserCheck } from 'lucide-react'

import { useMembersQuery } from '../../hooks/useMembership'
import { EventTeamMemberRow, type TeamMember } from './EventMemberRow'
import { EventTeamAssignmentSkeleton } from '../Skeleton'

type Props = {
  communityId: string
  selectedMembers: TeamMember[]
  onChange: (members: TeamMember[]) => void
  disabled?: boolean
}

export const EventTeamAssignment = ({ communityId, selectedMembers, onChange, disabled }: Props) => {
  const { data: members = [], isLoading } = useMembersQuery(communityId)

  // Create a map for O(1) lookups instead of using find()
  const selectedMap = useMemo(() => {
    const map = new Map<string, TeamMember>()
    selectedMembers.forEach((m) => map.set(m.userId, m))
    return map
  }, [selectedMembers])

  const handleToggle = useCallback(
    (userId: string, checked: boolean) => {
      if (checked) {
        onChange([...selectedMembers, { userId, role: 'COORDINATOR' }])
      } else {
        onChange(selectedMembers.filter((m) => m.userId !== userId))
      }
    },
    [selectedMembers, onChange]
  )

  const handleRoleChange = useCallback(
    (userId: string, role: TeamMember['role']) => {
      // Create a new array with the updated role for the specific user
      const updatedMembers = selectedMembers.map((member) => {
        if (member.userId === userId) {
          return { ...member, role }
        }
        return member
      })
      onChange(updatedMembers)
    },
    [selectedMembers, onChange]
  )

  return (
    <div className="bg-deep-ocean/75 border border-stone rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <UserCheck className="w-4 h-4 text-lavender" />
        <p className="text-fog text-xs uppercase tracking-widest">Assign Event Team</p>
      </div>

      {isLoading ? (
        <EventTeamAssignmentSkeleton />
      ) : members.length === 0 ? (
        <p className="text-fog/40 text-sm text-center py-4">No members in this community yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {members.map((member) => (
            <EventTeamMemberRow
              key={member.user.id}
              member={member}
              selected={selectedMap.get(member.user.id)}
              disabled={disabled}
              onToggle={handleToggle}
              onRoleChange={handleRoleChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}