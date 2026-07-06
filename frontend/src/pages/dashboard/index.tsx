import { Outlet } from "react-router-dom";

import Sidebar from "../../components/dashboard/Sidebar";

import { useDashboard } from "../../hooks/useDashboard";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import { useCallback, useState } from "react";


const DashboardLayout = () => {
  const { adminMemberships, isLoading } = useDashboard();
  const isAdmin = adminMemberships.length > 0;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

   const openMobileNav = useCallback(() => setMobileNavOpen(true), []);
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar isAdmin={isAdmin} adminCount={adminMemberships.length} mobileOpen={mobileNavOpen}
        onMobileClose={closeMobileNav} />

      <div className="lg:pl-44 w-full">
        <div className="mx-auto max-w-350 bg-night/20 ">
          <DashboardHeader onMenuClick={openMobileNav} />

          <main className="rounded-lg border border-slate bg-deep-ocean px-4">
            {isLoading ? (
              <p className="text-sm text-stone">Loading...</p>
            ) : (
              <Outlet context={{ isAdmin }} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;