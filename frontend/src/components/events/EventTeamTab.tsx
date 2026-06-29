import type { EventMember } from "../../types"


const roleBadgeClass = (role: string) => {
  const map: Record<string, string> = {
    HOST:        'text-amber-300 bg-amber-400/10 border-amber-400/20',
    SPEAKER:     'text-sky-300 bg-sky-400/10 border-sky-400/20',
    COORDINATOR: 'text-lavender bg-orchid/10 border-orchid/20',
    VOLUNTEER:   'text-emerald-300 bg-emerald-400/10 border-emerald-400/20',
  }
  return map[role] ?? 'text-fog bg-slate-800/50 border-slate-700'
}

const EventTeamTab = ({ members }: { members: EventMember[] }) => {
  if (!members.length) return (
    <div className="rounded-xl border border-gray-200 bg-deep-ocean p-8 text-center text-sm text-fog/50">
      No team members assigned yet.
    </div>
  )

  return (
    <div className="rounded-xl border border-gray-200 bg-deep-ocean p-5 shadow-sm space-y-3">
      {members.map((member) => (
        <div key={member.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {member.user.imageUrl ? (
              <img
                src={member.user.imageUrl}
                alt={member.user.name}
                className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-600"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-orchid/20 border border-orchid/30 flex items-center justify-center text-lavender text-xs font-medium">
                {member.user.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-mist text-sm font-medium">{member.user.name}</p>
              <p className="text-fog/40 text-xs">{member.user.email}</p>
            </div>
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${roleBadgeClass(member.role)}`}>
            {member.role.charAt(0) + member.role.slice(1).toLowerCase()}
          </span>
        </div>
      ))}
    </div>
  )
}

export default EventTeamTab