import { Link } from "react-router-dom"
import { Radar, Users } from "lucide-react"

export const Hero = () => {
    return (
        <section id="home" className="w-full py-20 px-4 max-w-5xl mx-auto space-y-25 h-dvh ">
            <h1 className="text-3xl md:text-6xl font-semibold leading-normal tracking-wide mb-6 text-center">
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

            <p className="text-sm md:text-lg text-fog/80 leading-relaxed text-center max-w-3xl mx-auto mt-4">
                Gatherly helps creators, clubs, organizations, and local groups build
                thriving communities and organize memorable events—all in one platform.
            </p>

            <div className="flex items-center md:items-center gap-2 md:gap-4 flex-col md:flex-row justify-center mt-8 md:mt-12">
                <Link to="/communities/create">
                    <button className="inline-flex items-center gap-1 px-2 md:px-5 py-2.5 bg-orchid text-white text-md md:text-lg font-light md:font-medium rounded-sm hover:bg-orchid/90 active:scale-[0.97] transition-all cursor-pointer">
                        <Users size={18} />
                        Create Community
                    </button>
                </Link>
                <Link to="/events">
                    <button className="inline-flex items-center gap-1 px-2 md:px-5 py-2.5 text-lavender text-md md:text-lg font-medium rounded-full border-3 border-orchid hover:bg-orchid/10 active:scale-[0.97] transition-all cursor-pointer">
                        <Radar size={18} />
                        Explore Events
                    </button>
                </Link>
            </div>
            <div className="mt-14">
            {/* Constellation */}
            <svg
              viewBox="0 0 320 80"
              className="w-64 md:w-80 h-auto mx-auto text-orchid"
              aria-hidden="true"
            >
              <g stroke="currentColor" strokeWidth="1" opacity="0.35">
                <line x1="30" y1="40" x2="100" y2="20" />
                <line x1="30" y1="40" x2="100" y2="60" />
                <line x1="100" y1="20" x2="160" y2="40" />
                <line x1="100" y1="60" x2="160" y2="40" />
                <line x1="160" y1="40" x2="230" y2="18" />
                <line x1="160" y1="40" x2="230" y2="62" />
                <line x1="230" y1="18" x2="290" y2="40" />
                <line x1="230" y1="62" x2="290" y2="40" />
              </g>
              {[
                [30, 40, 0],
                [100, 20, 0.4],
                [100, 60, 0.8],
                [160, 40, 1.2],
                [230, 18, 0.6],
                [230, 62, 1],
                [290, 40, 0.2],
              ].map(([cx, cy, delay], i) => (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={i === 3 ? 6 : 4.5}
                  fill="currentColor"
                  className="animate-pulse"
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}
            </svg>
          </div>
        </section>
    )
}
