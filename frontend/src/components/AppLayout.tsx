import { Outlet } from "react-router-dom";
import Wrapper from "./Wrapper";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

import Sidebar from "./dashboard/Sidebar";
import DashboardHeader from "./dashboard/DashboardHeader";

import { useDashboard } from "../hooks/useDashboard";
import { useAuth } from "@clerk/react";
import { useCallback, useState } from "react";

const AppLayout = () => {
    const { isSignedIn } = useAuth();

    const { adminMemberships } = useDashboard();

    const isAdmin = adminMemberships.length > 0;

    const [mobileOpen, setMobileOpen] = useState(false);

    const open = useCallback(() => setMobileOpen(true), []);
    const close = useCallback(() => setMobileOpen(false), []);

    return (
        <>
            <Wrapper>
                {
                    !isSignedIn && <Navbar />
                }

                <div className="flex">
                    {isSignedIn && (
                        <Sidebar
                            isAdmin={isAdmin}
                            adminCount={adminMemberships.length}
                            mobileOpen={mobileOpen}
                            onMobileClose={close}
                        />
                    )}

                    <div className="flex-1 ml-auto lg:max-w-4xl lg:19 xl:max-w-6xl xl:pl-10">
                        {isSignedIn && (
                            <DashboardHeader onMenuClick={open} />
                        )}

                        <Outlet />
                    </div>
                </div>
            </Wrapper>

            <Footer />
        </>
    );
};

export default AppLayout;