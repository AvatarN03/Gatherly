import { memo, useCallback } from 'react'
import { EVENT_MEMBER_ROLES, type EventMemberRole } from '../../types'
import { inputClass } from '../../constant'

export type TeamMember = {
  userId: string
  role: EventMemberRole
}

export type CommunityMember = {
  userId: string
  role: string
  user: {
    id: string
    name: string
    imageUrl: string
  }
}

type Props = {
  member: CommunityMember
  selected: TeamMember | undefined
  disabled?: boolean
  onToggle: (userId: string, checked: boolean) => void
  onRoleChange: (userId: string, role: EventMemberRole) => void
}

export const EventTeamMemberRow = memo(function EventTeamMemberRow({
  member,
  selected,
  disabled,
  onToggle,
  onRoleChange,
}: Props) {
  const userId = member.user.id 
  const inputId = `member-${userId}`

  const handleToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onToggle(userId, e.target.checked)
    },
    [userId, onToggle]
  )

  const handleRoleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onRoleChange(userId, e.target.value as EventMemberRole)
    },
    [userId, onRoleChange]
  )

  return (
    <div
      className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
        selected ? 'border-orchid/40 bg-orchid/5' : 'border-slate-700/50 bg-slate-800/30'
      }`}
    >
      <div className="flex items-center gap-3">
        <img
          src={member.user.imageUrl}
          alt={member.user.name}
          className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-600"
        />
        <div>
          <p className="text-mist text-sm font-medium">{member.user.name}</p>
          <p className="text-fog/50 text-xs">{member.role}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id={inputId}
          type="checkbox"
          checked={!!selected}
          disabled={disabled}
          aria-label={`Assign ${member.user.name} to event team`}
          className="accent-orchid cursor-pointer"
           onChange={handleToggle}
        />
        <label htmlFor={inputId} className="sr-only">
          Assign {member.user.name}
        </label>

        <select
          disabled={!selected || disabled}
          value={selected?.role ?? 'COORDINATOR'}
          aria-label={`Role for ${member.user.name}`}
          onChange={handleRoleChange}
          className={`${inputClass} py-1 px-2 text-xs disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {EVENT_MEMBER_ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
})