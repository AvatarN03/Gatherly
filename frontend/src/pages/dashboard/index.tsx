import DashboardStats from "../../components/dashboard/dashboardStats";
import AdminView from "../../components/dashboard/adminView";
import UserView from "../../components/dashboard/userView";
import { useDashboardOverview } from "../../hooks/useDashboardOverview";

const Dashboard = () => {
  const { data: dashboard, isLoading } = useDashboardOverview();

  if (isLoading || !dashboard) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="h-28 animate-pulse rounded-2xl bg-gray-100" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="h-96 animate-pulse rounded-2xl bg-gray-100" />
          <div className="h-96 animate-pulse rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  const hasAdminData =
    dashboard.adminMemberships.length > 0 || dashboard.createdEvents.length > 0;

  const hasUserData =
    dashboard.myMemberships.length > 0 ||
    dashboard.myRegistrations.length > 0 ||
    dashboard.myEventRoles.length > 0;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
          Overview
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-500">
          Track your communities, events, registrations, and pending requests from one place.
        </p>
      </div>

      <DashboardStats data={dashboard} />

      <div className="space-y-6">
        {hasAdminData && <AdminView data={dashboard} />}
        {hasUserData && <UserView data={dashboard} />}

        {!hasAdminData && !hasUserData && (
          <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
            Nothing to show here yet — join a community or create an event to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;