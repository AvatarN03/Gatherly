import { Users, CalendarDays, ShieldCheck, ClipboardList } from "lucide-react";

type Props = {
  memberCount: number;
  eventCount: number;
  adminCount: number;
  requestCount: number;
};

const STATS = (p: Props) => [
  { label: "Members",  value: p.memberCount,  icon: Users },
  { label: "Events",   value: p.eventCount,   icon: CalendarDays  },
  { label: "Admins",   value: p.adminCount,   icon: ShieldCheck},
  { label: "Requests", value: p.requestCount, icon: ClipboardList },
];

const CommunityStats = (props: Props) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl">
    {STATS(props).map(({ label, value, icon: Icon }) => (
      <div
        key={label}
        className="relative flex items-center gap-3 rounded-xl bg-forest-teal border border-[#182F3D] px-4 py-3.5 overflow-hidden"
      >
        {/* faint icon watermark */}
        <Icon className={`absolute -right-2 -bottom-2 w-14 h-14 opacity-5`} />

        <div className={`shrink-0 p-2 rounded-lg  border `}>
          <Icon className={`w-4 h-4 `} />
        </div>

        <div>
          <p className={`text-xl font-semibold`}>{value}</p>
          <p className="text-mist font-semibold text-xs">{label}</p>
        </div>
      </div>
    ))}
  </div>
);

export default CommunityStats;