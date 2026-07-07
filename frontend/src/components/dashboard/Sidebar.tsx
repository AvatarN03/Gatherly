import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
    ShieldCheck,
    Compass,
    Calendar,
    Inbox,
    ChevronRight,
    type LucideIcon,
    Home,
    FolderKanban,
    UsersRound,
    UserCheck,
    CalendarRange,
    Ticket,
    ClipboardCheck,
    Search,
} from "lucide-react";

type LinkItem = { title: string; path: string; end?: boolean; icon?: LucideIcon | undefined };
type LinkGroup = { title: string; icon: LucideIcon; items: LinkItem[] };

const overviewLink: LinkItem = {
    title: "Overview",
    path: "/dashboard",
    end: true
};

const communityGroup: LinkGroup = {
    title: "Communities",
    icon: UsersRound,
    items: [
        { title: "My", path: "/communities/my", end: true, icon: FolderKanban },
        { title: "Managed", path: "/communities/managed", end: true, icon: ShieldCheck },
        { title: "Joined", path: "/communities/joined", end: true, icon: UserCheck },
        { title: "Browse", path: "/communities", end: true, icon: Compass },
    ],
};

const eventGroup: LinkGroup = {
    title: "Events",
    icon: CalendarRange,
    items: [
        { title: "My", path: "/events/my", end: true, icon: Calendar },
        { title: "Registered", path: "/events/registered", end: true, icon: Ticket },
        { title: "Assigned", path: "/events/assigned", end: true, icon: ClipboardCheck },
        { title: "Browse", path: "/events", end: true, icon: Search },
    ],
};

const adminGroup: LinkGroup = {
    title: "Admin",
    icon: Inbox,
    items: [{ title: "Community Requests", path: "/dashboard/communities-requests", icon: Inbox },
    { title: "Event Registrations", path: "/dashboard/events-registrations", icon: Inbox }],
};


const NavGroup = ({
    group,
    showLabels,
    onNavigate,
    defaultOpen = true,
}: {
    group: LinkGroup;
    showLabels: boolean;
    onNavigate?: () => void;
    defaultOpen?: boolean;
}) => {
    const [open, setOpen] = useState(defaultOpen);
    const GroupIcon = group.icon;
    const showItems = showLabels ? open : true;

    return (
        <div className="rounded-xl border border-slate/70 bg-night/40 overflow-x-hidden overflow-y-auto">
            <button
                onClick={() => showLabels && setOpen((o) => !o)}
                title={!showLabels ? group.title : undefined}
                className={`flex bg-lavender/20 mb-2 w-full items-center gap-2 py-2.5 text-left ${showLabels ? "px-3" : "justify-center px-0"
                    }`}
            >

                <GroupIcon className="h-5 w-5" strokeWidth={2} />

                {showLabels && (
                    <>
                        <span className="flex-1 whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider text-fog">
                            {group.title}
                        </span>
                        <ChevronRight
                            className={`h-4 w-4 shrink-0 text-cocoa transition-transform duration-200 ${open ? "rotate-90" : ""
                                }`}
                        />
                    </>
                )}
            </button>

            <div
                className={`grid  transition-all duration-200 ease-out ${showItems ? "grid-rows-[1fr] opacity-100 pl-3 " : "grid-rows-[0fr] opacity-0"
                    }`}
            >
                <div className="overflow-hidden">
                    <div className={`flex flex-col gap-3 pb-2 ${showLabels ? "px-2" : "px-1.5"}`}>
                        {group.items.map((link) => {
                            const Icon = link.icon;
                            return (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    end={link.end}
                                    title={link.title}
                                    onClick={onNavigate}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2.5 rounded-lg py-1.5 text-sm transition-colors ${showLabels ? "pl-2 pr-3" : "justify-center px-2"
                                        } ${isActive
                                            ? "bg-orchid text-white font-medium shadow-sm shadow-orchid/30"
                                            : "text-fog hover:bg-cocoa/50 hover:text-mist"
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            {Icon && (
                                                <Icon
                                                    className={`h-4 w-4 ${isActive ? "text-white" : "text-stone"
                                                        }`}
                                                />
                                            )}
                                            {showLabels && (
                                                <span className="truncate whitespace-nowrap">{link.title}</span>
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Sidebar = (
    {
        isAdmin,
        adminCount,
        mobileOpen,
        onMobileClose }: {
            isAdmin: boolean;
            adminCount: number,
            mobileOpen: boolean;
            onMobileClose: () => void;
        }) => {
    const [expanded, setExpanded] = useState(true);
    const showLabels = expanded || mobileOpen;

    // Lock body scroll while the mobile drawer is open, so the page behind
    // it can't scroll underneath and fight with the drawer's own scrolling.
    useEffect(() => {
        if (!mobileOpen) return;

        const { overflow, touchAction } = document.body.style;
        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";

        return () => {
            document.body.style.overflow = overflow;
            document.body.style.touchAction = touchAction;
        };
    }, [mobileOpen]);

    useEffect(() => {
        const mql = window.matchMedia("(min-width: 1024px)");

        const handleChange = (e: MediaQueryListEvent) => {
            if (e.matches) onMobileClose();
        };

        mql.addEventListener("change", handleChange);
        return () => mql.removeEventListener("change", handleChange);
    }, [onMobileClose]);

    return (
        <>
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={onMobileClose}
                    aria-hidden="true"
                />
            )}

            <aside
                onMouseEnter={() => setExpanded(true)}
                onMouseLeave={() => setExpanded(false)}
                onClick={() => setExpanded(prev => !prev)}
                className={`fixed inset-y-0 left-0 z-50 flex w-72 backdrop-blur-md h-dvh flex-col  overflow-hidden border-r border-stone bg-night md:bg-night/20 transition-all duration-300 rounded-tr-2xl rounded-br-2xl ease-out ${mobileOpen ? "translate-x-0 shadow-2xl shadow-black/50" : "-translate-x-full"
                    } lg:translate-x-0 ${expanded ? "w-[90%] lg:w-64 lg:shadow-2xl lg:shadow-black/50 border-r-2" : "lg:w-19"}`}
            >
                {/* Logo */}
                <div
                    className={`flex items-center gap-2.5 overflow-hidden border-b border-stone/70 py-8 ${showLabels ? "px-3.5" : "justify-center px-0"
                        }`}
                >
                    <Link to="/">
                        <div className="text-xl font-semibold tracking-wider text-lavender flex items-center gap-1 group">
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="w-8 h-8 group-hover:scale-110 transition-transform group-hover:rotate-90 duration-300"
                            />
                            {showLabels && (
                                <h3>
                                    G
                                    <span className="text-fog/70 group-hover:text-lavender underline-hover transition-colors">
                                        atherly
                                    </span>
                                </h3>
                            )}
                        </div>
                    </Link>
                </div>

                {/* Nav */}
                <div className="min-h-0 flex flex-1 flex-col gap-2 overflow-y-auto overscroll-contain px-2 py-4">
                    <NavLink
                        to={overviewLink.path}
                        end={overviewLink.end}
                        title={overviewLink.title}
                        className={({ isActive }) =>
                            `flex items-center gap-2.5 rounded-xl border py-3 text-sm font-medium transition-colors ${expanded ? "px-3.5" : "justify-center px-0"
                            } ${isActive
                                ? "border-cocoa border-2 bg-deep-ocean text-mist"
                                : "border-slate/70 bg-deep-ocean/60 text-fog hover:bg-orchid/40 hover:text-fog"
                            }`
                        }
                    >
                        <>
                            <span
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate/60"                        >
                                <Home
                                    className="h-4 w-4 text-mist"
                                    strokeWidth={2}
                                />
                            </span>
                            {showLabels && <span className="whitespace-nowrap">{overviewLink.title}</span>}
                        </>
                    </NavLink>

                    <NavGroup group={communityGroup} showLabels={showLabels} onNavigate={onMobileClose} />
                    <NavGroup group={eventGroup} showLabels={showLabels} onNavigate={onMobileClose} />
                    {isAdmin && <NavGroup group={adminGroup} showLabels={showLabels} onNavigate={onMobileClose} />}

                    {isAdmin && (
                        <div
                            title={
                                !showLabels
                                    ? `Admin in ${adminCount} ${adminCount === 1 ? "community" : "communities"}`
                                    : undefined
                            }
                            className={`rounded-xl border border-orchid/30 bg-linear-to-br from-orchid/15 to-orchid/5 py-3 ${showLabels ? "px-3.5" : "flex justify-center px-0"
                                }`}
                        >
                            <div className="flex items-center gap-2 text-pink-300">
                                <ShieldCheck className="h-4 w-4 shrink-0" strokeWidth={2} />
                                {showLabels && (
                                    <span className="whitespace-nowrap text-xs font-semibold">
                                        Admin in {adminCount} {adminCount === 1 ? "community" : "communities"}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </aside >
        </>
    );
};

export default Sidebar;