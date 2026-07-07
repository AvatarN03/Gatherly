import type { DashboardStatsSummary } from "../../types";

type DashboardStatsData = {
  stats: DashboardStatsSummary;
};

type Props = { data: DashboardStatsData };

const DashboardStats = ({ data }: Props) => {
  const allStats = [
    { label: "Communities managed", value: data.stats.communitiesManaged, icon: "ti-users" },
    { label: "Communities joined", value: data.stats.communitiesJoined, icon: "ti-users" },
    { label: "Events created", value: data.stats.eventsCreated, icon: "ti-calendar-event" },
    { label: "Events registered", value: data.stats.eventsRegistered, icon: "ti-calendar-check" },
    { label: "Event roles", value: data.stats.eventRoles, icon: "ti-award" },
    { label: "Pending requests", value: data.stats.pendingRequests, icon: "ti-clock" },
    { label: "Total members", value: data.stats.totalMembers, icon: "ti-user-check" },
  ];

  // Only show stats that actually have something to report
  const visibleStats = allStats.filter((stat) => stat.value > 0);

  if (visibleStats.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {visibleStats.map(({ label, value, icon }) => (
        <div key={label} className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm">
          <i className={`ti ${icon} text-xl text-gray-400`} aria-hidden="true" />
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          <p className="mt-0.5 text-xs text-gray-500">{label}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;