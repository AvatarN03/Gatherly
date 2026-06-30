import { Users, UserCheck, CalendarDays } from 'lucide-react'

type Props = {
  memberCount: number
  registrationCount: number
  createdAt: string
}

const STATS = (p: Props) => [
  { label: 'Team',        value: p.memberCount,       icon: UserCheck   },
  { label: 'Registered',  value: p.registrationCount, icon: Users       },
  { label: 'Posted',      value: new Date(p.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), icon: CalendarDays, small: true },
]

const EventStats = (props: Props) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full md:w-fit">
    {STATS(props).map(({ label, value, icon: Icon, small }) => (
      <div
        key={label}
        className="relative flex items-center gap-3 rounded-xl bg-forest-teal border border-slate px-4 py-3.5 overflow-hidden"
      >
        <Icon className="absolute -right-2 -bottom-2 w-14 h-14 opacity-5" />
        <div className="shrink-0 p-2 rounded-lg border">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className={`font-semibold ${small ? 'text-sm' : 'text-xl'}`}>{value}</p>
          <p className="text-mist font-semibold text-xs">{label}</p>
        </div>
      </div>
    ))}
  </div>
)

export default EventStats