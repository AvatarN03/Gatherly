import { useState } from "react";
import { Link, NavLink, matchPath, useLocation } from "react-router-dom";
import type { NavSection } from "../../types";
import { sections } from "../../constant";
import { X } from "lucide-react";

const Sidebar = ({
    isAdmin,
    isOpen,
    onClose,
}: {
    isAdmin: boolean;
    isOpen: boolean;
    onClose: () => void;
}) => {
    const location = useLocation();

    const isPathActive = (path?: string, end?: boolean) => {
        if (!path) return false;
        return !!matchPath({ path, end: end ?? false }, location.pathname);
    };

    const isSectionActive = (section: NavSection) => {
        if (section.href && isPathActive(section.href, true)) return true;
        return section.subItems?.some((si) => isPathActive(si.path, si.end)) ?? false;
    };

    const visibleSections = sections.filter((s) => s.key !== "Admin" || isAdmin);

    // activeKey must be initialized before anything (like activeSection) reads it
    const getInitialKey = () =>
        visibleSections.find(isSectionActive)?.key ??
        visibleSections[0].key;

    const [activeKey, setActiveKey] = useState(getInitialKey);

    const activeSection = visibleSections.find((s) => s.key === activeKey);

    const renderRailIcon = (section: NavSection) => {
        const Icon = section.icon;
        const opened = activeKey === section.key;

        return (
            <button
                key={section.key}
                title={section.title}
                onClick={() => setActiveKey(section.key)}
                className={`flex items-center justify-center w-10 h-10 rounded-md transition-colors cursor-pointer ${opened ? "bg-cocoa" : "hover:bg-stone/20"
                    }`}
            >
                <Icon className={`w-5 h-5 shrink-0 ${opened ? "text-white" : "text-white/60"}`} />
            </button>
        );
    };

    const renderPanelContent = () => {
        if (!activeSection) return null;
        return (
            <>
                <p className="text-xs font-medium text-lavender px-2 mb-4 uppercase tracking-wide underline underline-offset-4 decoration-wavy decoration-cocoa">
                    {activeSection.title}
                </p>

                {activeSection.href && !activeSection.subItems?.length && (
                    <NavLink
                        to={activeSection.href}
                        end
                        onClick={onClose}
                        className={({ isActive }) =>
                            `px-3 py-2 rounded-md text-sm transition-colors ${isActive
                                ? "bg-orchid text-black font-semibold"
                                : "text-white/70 hover:bg-white/10"
                            }`
                        }
                    >
                        {activeSection.title}
                    </NavLink>
                )}

                {activeSection.subItems?.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${isActive
                                    ? "bg-orchid/70 text-mist font-semibold translate-x-2.5"
                                    : "text-fog hover:bg-stone/20 transition-transform  hover:translate-x-1.5"
                                }`
                            }
                        >
                            {ItemIcon && <ItemIcon className="w-4 h-4 shrink-0" />}
                            {item.title}
                        </NavLink>
                    );
                })}
            </>
        );
    };

    const renderHeader = () => (
        <div className="flex items-center justify-between px-4 py-4 border-b border-fog/20">
            <Link to="/" onClick={onClose}>
                <div className="text-xl font-semibold tracking-wider text-lavender flex items-center gap-3 group">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="w-12 h-12 group-hover:scale-110 transition-transform group-hover:rotate-90 duration-300"
                    />
                    <h3 className="text-mist text-2xl font-medium tracking-wider">
                        G
                        <span className="text-fog/70 group-hover:text-lavender underline-hover transition-colors">
                            atherly
                        </span>
                    </h3>
                </div>
            </Link>

            <button onClick={onClose} className=" lg:hidden p-2 rounded-md bg-slate hover:bg-stone/20 shrink-0">
                <X className="w-5 h-5 text-white" />
            </button>

        </div>
    );

    const renderBody = () => (
        <div className="flex flex-1 min-h-0">
            {/* column 1: icons */}
            <div className="flex flex-col items-center w-16 py-8 gap-6 border-r border-fog/40 bg-night">
                {visibleSections.map(renderRailIcon)}
            </div>
            {/* column 2: links for the active section */}
            <div className="flex-1 bg-deep-ocean p-3 pt-7 pr-5 flex flex-col gap-1 overflow-y-auto">
                {renderPanelContent()}
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop */}
            <div className="hidden lg:flex flex-col w-72 h-dvh bg-night shadow-lg shadow-black/40">
                {renderHeader()}
                {renderBody()}
            </div>

            {/* Mobile drawer */}
            {isOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div className="flex flex-col w-72 h-dvh bg-night shadow-lg shadow-black/40">
                        {renderHeader()}
                        {renderBody()}
                    </div>
                    <div className="flex-1 bg-black/40 backdrop-blur-xs" onClick={onClose} />
                </div>
            )}
        </>
    );
};

export default Sidebar;