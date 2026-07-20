import { Users, CalendarDays, ClipboardList } from "lucide-react";

type Props = {
  memberCount: number;
  eventCount: number;
  requestCount: number;
};

const STATS = (p: Props) => [
  { label: "Members",  value: p.memberCount,  icon: Users },
  { label: "Events",   value: p.eventCount,   icon: CalendarDays  },
  { label: "Requests", value: p.requestCount, icon: ClipboardList },
];

const CommunityStats = (props: Props) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl">
    {STATS(props).map(({ label, value, icon: Icon }) => (
      <div
        key={label}
        className="relative flex items-center gap-3 rounded-md bg-lavender/80 border border-fog/20 px-4 py-3.5 overflow-hidden"
      >
        {/* faint icon watermark */}
        <Icon className={`absolute -right-2 -bottom-2 w-14 h-14 opacity-50`} />

        <div className={`shrink-0 p-2 rounded-lg  border bg-lavender text-deep-ocean`}>
          <Icon className={`w-4 h-4 `} />
        </div>

        <div className="text-deep-ocean">
          <p className={`text-xl font-semibold`}>{value}</p>
          <p className=" font-semibold text-xs">{label}</p>
        </div>
      </div>
    ))}
  </div>
);

export default CommunityStats;