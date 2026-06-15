import { Link } from "react-router-dom"
import { Radar, Users } from "lucide-react"

export const Hero = () => {
    return (
        <section className="w-full py-20 px-4 max-w-5xl mx-auto space-y-25 h-dvh ">
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.35] tracking-wide mb-6 text-center">
                Communities{" "}
                <span className="text-purple-400 relative inline-block">
                    don&apos;t
                    <span className="absolute left-0 right-0 bottom-2 h-0.5 rounded-full bg-linear-to-r from-fuchsia-400 to-purple-500" />
                </span>{" "}
                fail because of{" "}
                <span className="relative inline-block px-1.5 z-10 text-slate">
                    ideas.
                    <span className="absolute inset-y-0.5 -inset-x-1 bg-amber-200 rounded-sm -z-10 rotate-[-1.5deg]" />
                </span>{" "}
                They fail because people lose{" "}
                <span className="relative inline-block px-1.5 z-10 text-slate">
                    connection.
                    <span className="absolute inset-y-0.5 -inset-x-1 bg-emerald-200 rounded-sm -z-10 rotate-[1.2deg]" />
                </span>
            </h1>

            <p className="text-lg text-fog leading-relaxed">
                Gatherly helps creators, clubs, organizations, and local groups build
                thriving communities and organize memorable events—all in one platform.
            </p>

            <div className="flex items-start md:items-center gap-3 flex-col md:flex-row ">
                <Link to="/communities/create">
                    <button className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-orchid text-white text-lg font-medium rounded-sm hover:bg-orchid/90 active:scale-[0.97] transition-all cursor-pointer">
                        <Users size={18} />
                        Create community
                    </button>
                </Link>
                <Link to="/events">
                    <button className="inline-flex items-center gap-1.5 px-5 py-2.5 text-lavender text-lg font-medium rounded-full border-3 border-orchid hover:bg-orchid/10 active:scale-[0.97] transition-all cursor-pointer">
                        <Radar size={18} />
                        Explore events
                    </button>
                </Link>
            </div>
        </section>
    )
}
