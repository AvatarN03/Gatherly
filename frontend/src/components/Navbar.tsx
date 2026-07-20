import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Menu, Users, X, LogIn, SquarePen } from "lucide-react";
import { SignInButton, SignUpButton, useAuth, UserButton, useUser } from "@clerk/react";
import { HomeNavLinks } from "../constant";

export const Navbar = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef?.current?.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className={`min-h-18 w-full flex items-center border-b-3 border-fog/50 sticky top-0 z-50 rounded-b-md transition-all duration-300 bg-night ${isMenuOpen
        ? "bg-night backdrop-blur-none border-transparent"
        : " backdrop-blur-sm"
        }`}
    >
      <nav
        ref={menuRef}  // ← ref wraps only the nav, not the whole page
        className="flex items-center justify-between max-w-400 mx-auto w-full px-3"
      >
        <div className="flex items-center gap-4">

          {/* Logo */}
          <Link to="/" onClick={closeMenu}>
            <div className="text-xl font-semibold tracking-wider text-lavender flex items-center gap-1 group">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-8 h-8 group-hover:scale-110 transition-transform group-hover:rotate-90 duration-300"
              />
              <h3 className="hidden md:block text-mist text-lg font-semibold tracking-wider">
                G
                <span className="text-fog/70 group-hover:text-lavender underline-hover transition-colors">
                  atherly
                </span>
              </h3>
            </div>
          </Link>
          <ul className="hidden md:flex gap-2 mx-2 text-slate-400">
            {
              HomeNavLinks.map((navLink, idx) => (
                <li key={idx} className={navLink.classes ?? ""} title={navLink.title}>
                  <a href={navLink.link} className="hover:text-lavender tracking-wide transition-colors underline-hover text-xs p-2 rounded-sm bg-deep-ocean hover:bg-fog/10">
                    {navLink.name}
                  </a>
                </li>
              ))
            }
          </ul>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
          {/* Desktop links */}
          <ul className="space-x-4 hidden md:flex">
            <Link
              to="/communities"
              className="hover:text-lavender flex items-center transition-colors underline-hover text-xs lg:text-sm p-2 rounded-sm bg-deep-ocean hover:bg-fog/10"
            >
              <Users className="w-4 h-4 inline-block mr-1" />
              Communities
            </Link>
            <Link
              to="/events"
              className="hover:text-lavender flex items-center transition-colors underline-hover text-xs lg:text-sm p-2 rounded-sm bg-deep-ocean hover:bg-fog/10"
            >
              <CalendarDays className="w-4 h-4 inline-block mr-1" />
              Events
            </Link>
          </ul>

          <div className="min-w-24 flex items-center justify-center gap-3">
            {isLoaded ? (
              !isSignedIn ? (
                <SignInButton mode="modal">
                  <button className="px-3.5 py-2 rounded-full flex items-center gap-2 text-sm cursor-pointer bg-orchid/30 text-mist transition-colors hover:text-white border-2 border-stone hover:bg-orchid/40">
                    <LogIn className="w-5 h-5" />Sign In
                  </button>
                </SignInButton>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className="px-2 py-1.5 border-orchid border text-sm text-mist rounded-xl hover:rounded-2xl bg-stone/30 hover:bg-orchid/10 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <div className="hidden md:block">
                    <UserButton />
                  </div>
                </>
              )
            ) : (
              <div className="w-36 h-8 rounded-sm bg-stone animate-pulse" />
            )}
          </div>

          {/* Hamburger button */}
          <button
            className="block md:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? (
              <X className="w-9 h-9 text-lavender" />
            ) : (
              <Menu className="w-9 h-9 text-lavender" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`absolute top-full left-0 w-full bg-deep-ocean/90 backdrop-blur-sm flex flex-col items-center gap-4 px-4 p-4 md:hidden overflow-hidden transition-all duration-300 ease-in-out rounded-b-3xl border-4 border-orchid/50 border-t-0 ${isMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
            }`}
        >
          <div className="flex flex-col items-center w-full divide-y divide-fog gap-4">
            <Link
              to="/communities"
              onClick={closeMenu}  // ← closes menu
              className="flex items-center gap-8 text-mist text-2xl py-4 w-full"
            >
              <Users className="w-10 h-10" />
              Communities
            </Link>

            <Link
              to="/events"
              onClick={closeMenu}  // ← closes menu
              className="flex items-center gap-8 text-mist text-2xl py-4 w-full"
            >
              <CalendarDays className="w-10 h-10" />
              Events
            </Link>

            {isLoaded ? (
              !isSignedIn ? (
                <div className="flex items-center gap-3 w-full">
                  <SignInButton mode="modal">
                    <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orchid/15 py-4 px-3 text-xl cursor-pointer text-mist transition-colors hover:text-white">
                      <LogIn className="w-6 h-6" /> Sign In
                    </button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orchid/60 py-4 px-3 text-xl cursor-pointer text-mist transition-colors hover:text-white">
                      <SquarePen className="w-6 h-6" />
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              ) : (
                <div className="flex items-center gap-3 my-4" onClick={closeMenu}>
                  <UserButton />
                  <span className="text-mist">{user?.firstName || "Profile"}</span>
                </div>
              )
            ) : (
              <div className="w-36 h-8 rounded-sm bg-stone animate-pulse" />
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};