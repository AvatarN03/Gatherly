
import { Link } from "react-router-dom";
import { useUser, UserButton } from "@clerk/react";
import { Bell, CalendarRange, Menu, Plus, UsersRound } from "lucide-react";

const DashboardHeader = ({ onMenuClick }: { onMenuClick: () => void }) => {
    const { user, isLoaded } = useUser();

    const firstName = user?.firstName || user?.username || "there";
    const fullName = user?.fullName || user?.username || "Your account";

    return (
        <header className="mb-1 bg-night/80 p-4 rounded-xl flex  gap-4 border-b border-stone py-6  sm:items-center justify-between">
            <button
                type="button"
                onClick={onMenuClick}
                aria-label="Open menu"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate/70 bg-deep-ocean text-fog transition-colors hover:bg-slate/40 hover:text-mist lg:hidden"
            >
                <Menu className="h-5 w-5" strokeWidth={2} />
            </button>

            {/* Welcome */}
            <div className="hidden md:flex">
                                <h1 className="text-xl font-semibold text-fog">
                    Welcome back{isLoaded ? "," : ""} <span className="text-pink-200">{isLoaded ? firstName : ""}</span>
                </h1>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
                <Link
                    to="/communities/create"
                    className="flex items-center gap-1.5 rounded-lg border border-slate/70 bg-yellow-600 px-3.5 py-2 text-sm font-medium text-night transition-colors hover:bg-yellow-600/40 hover:text-mist"
                >
                    <Plus className="h-4 w-4" strokeWidth={2} />
                    <p className="hidden md:block">Community</p>
                    <UsersRound className="h-4 w-4 md:hidden" />
                </Link>

                <Link
                    to="/events/create"
                    className="flex items-center gap-1.5 rounded-lg bg-orchid px-3.5 py-2 text-sm font-medium text-white shadow-sm shadow-orchid/30 transition-colors hover:bg-orchid/90"
                >
                    <Plus className="h-4 w-4" strokeWidth={2} />
                    <p className="hidden md:block">Event</p>
                    <CalendarRange className="h-4 w-4 md:hidden" />
                </Link>

                {/* Notifications */}
                <button
                    type="button"
                    aria-label="Notifications"
                    className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate/70 bg-deep-ocean text-fog transition-colors hover:bg-slate/40 hover:text-mist"
                >
                    <Bell className="h-4 w-4" strokeWidth={2} />
                    <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-orchid" />
                </button>

                {/* Clerk profile — avatar + name, dropdown (manage account / sign out) built in */}
                <div className="flex items-center gap-2.5 rounded-lg border border-slate/70 bg-deep-ocean py-1.5 pl-1.5 pr-1.5 md:pr-3">
                    <UserButton
                        appearance={{ elements: { avatarBox: "h-7 w-7 rounded-lg" } }}
                    />
                    <span className="hidden md:max-w-35 truncate text-sm font-medium text-mist sm:inline">
                        {isLoaded ? fullName : "Loading..."}
                    </span>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;