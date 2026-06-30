import { Badge } from "../Badge"

import { EVENT_ROLE_BADGES } from "../../constant"

import type { EventMember } from "../../types"


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
          <Badge
            config={
              EVENT_ROLE_BADGES[
              member.role as keyof typeof EVENT_ROLE_BADGES
              ]
            }
          />
        </div>
      ))}
    </div>
  )
}

export default EventTeamTab