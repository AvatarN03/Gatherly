import { Link } from 'react-router-dom'

import { CalendarPlus, Compass, Users } from 'lucide-react'

export const Footer = () => {
    return (
        <footer className="bg-night  border-t-2 border-b-8 border-stone px-12 pt-10 pb-6 mt-12 rounded-b-md rounded-t-sm max-w-7xl mx-auto">

            {/* Top grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

                {/* Brand */}
                <div className="flex flex-col gap-4 col-span-1 md:col-span-2">
                    <Link to="/">
                        <div className="text-xl font-semibold tracking-wider text-lavender flex items-center gap-1 group">
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="w-8 h-8 group-hover:scale-110 transition-transform group-hover:rotate-90 duration-300"
                            />
                            <h3>
                                G
                                <span className="text-fog/70 group-hover:text-lavender underline-hover transition-colors">
                                    atherly
                                </span>
                            </h3>
                        </div>
                    </Link>
                    <p className="text-sm text-fog/60 leading-relaxed">
                        The home for communities that actually show up. Build, grow, and gather — all in one place.
                    </p>
                    <div className="flex gap-2">
                        <Link to="https://github.com/AvatarN03/Gatherly" target="_blank" rel="noopener noreferrer"
                            className="rounded-lg border border-white/10 flex items-center justify-center
                text-fog/50 px-2 hover:text-lavender hover:bg-white/5 transition-colors cursor-pointer">
                            <img
                                src="/github.png"
                                alt="github"
                                className="w-8 h-8"
                            />
                            GitHub
                        </Link>
                    </div>
                </div>

                {/* Product */}
                <div className="flex flex-col gap-2.5">
                    <p className="text-[11px] font-medium text-fog/60 tracking-widest uppercase mb-1">Product</p>
                    {[
                        { label: "Explore events", to: "/events", icon: <Compass size={13} /> },
                        { label: "Communities", to: "/communities", icon: <Users size={13} /> },
                        { label: "Host an event", to: "/events/create", icon: <CalendarPlus size={13} /> }
                    ].map(({ label, to, icon }) => (
                        <Link key={label} to={to}
                            className="text-sm text-fog/50 hover:text-lavender flex items-center gap-1.5 transition-colors w-fit">
                            {icon}{label}
                        </Link>
                    ))}
                </div>

                {/* Company */}
                <div className="flex flex-col gap-2.5">
                    <p className="text-[11px] font-medium text-fog/60 tracking-widest uppercase mb-1">Company</p>

                    <Link to="/about" className="text-sm text-fog/50 hover:text-lavender transition-colors cursor-pointer w-fit">
                        About us
                    </Link>
                    <Link to="/contact" className="text-sm text-fog/50 hover:text-lavender transition-colors cursor-pointer w-fit">
                        Contact us
                    </Link>
                </div>



            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-between border-t border-white/10 pt-5 mt-2">
                <p className="text-xs text-fog/40">© 2026 <span className="text-lavender">Gatherly</span>. All rights reserved.</p>
                <div className="hidden md:flex items-center gap-4">
                    {["Privacy", "Terms", "Cookies"].map(label => (
                        <a key={label} className="text-xs text-fog/40 hover:text-fog/70 transition-colors cursor-pointer">
                            {label}
                        </a>
                    ))}
                </div>
            </div>

        </footer>
    )
}
