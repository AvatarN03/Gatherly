import { Outlet } from "react-router-dom";
import Wrapper from "./Wrapper";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

import Sidebar from "./dashboard/Sidebar";
import DashboardHeader from "./dashboard/DashboardHeader";

import { useAuth } from "@clerk/react";
import {useState } from "react";
import {  useIsAdmin } from "../hooks/useDashboardOverview";

const AppLayout = () => {
    const { isSignedIn } = useAuth();
     const [sidebarOpen, setSidebarOpen] = useState(false);



    const { data: role, isLoading } = useIsAdmin(!!isSignedIn);

    if (isSignedIn && isLoading) {
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
    const isAdmin = role?.isAdmin ?? false;

    return (
        <>
            <Wrapper>
                {
                    !isSignedIn && <Navbar />
                }

                <div className="flex ">
                     {isSignedIn && (
                        <Sidebar
                            isAdmin={isAdmin}
                            isOpen={sidebarOpen}
                            onClose={() => setSidebarOpen(false)}
                        />
                    )}

                    {/* w-20 matches the icon-rail width so content isn't tucked underneath it on desktop */}
                    <div className={`flex-1 lg:ml-4`}>
                        {isSignedIn && (
                            <DashboardHeader
                                onOpen={() => setSidebarOpen(true)}
                            />
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