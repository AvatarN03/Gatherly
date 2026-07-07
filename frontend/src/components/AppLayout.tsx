import { Outlet } from "react-router-dom";
import Wrapper from "./Wrapper";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

import Sidebar from "./dashboard/Sidebar";
import DashboardHeader from "./dashboard/DashboardHeader";

import { useAuth } from "@clerk/react";
import { useCallback, useState } from "react";
import { useDashboardOverview } from "../hooks/useDashboardOverview";

const AppLayout = () => {
    const { isSignedIn } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const open = useCallback(() => setMobileOpen(true), []);
    const close = useCallback(() => setMobileOpen(false), []);



    const { data, isLoading } = useDashboardOverview();
    if (isLoading || !data) {
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

    const isAdmin = data.isAdmin;

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