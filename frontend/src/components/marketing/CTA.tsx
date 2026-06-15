import { Link } from 'react-router-dom'

import { CalendarPlus, Compass, Radar } from 'lucide-react'

export const CTA = () => {
  return (
     <section className="w-full h-fit py-25 md:px-12 relative flex items-start justify-center">
        <div className="w-full h-full z-0 absolute top-0 left-0 rounded-2xl overflow-hidden">
          <img
            src="/cta.jpeg"
            alt="Join Gatherly"
            className="w-full h-full object-cover rounded-2xl shadow-lg border-orchid border-3"
          />
        </div>

        <div className="relative z-20">
          <h1 className="text-4xl mb-5 font-bold text-lavender">CTA</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 border border-white/10 rounded-2xl overflow-hidden ">

            {/* Left — copy + CTAs */}
            <div className="flex flex-col justify-center gap-5 p-10 bg-night/70">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-orchid/15 text-lavender w-fit">
                <Radar size={12} /> Events near you
              </span>

              <div>
                <h2 className="text-3xl font-medium text-lavender leading-snug mb-2">
                  Find your next<br />favourite gathering
                </h2>
                <p className="text-fog/70 text-sm leading-relaxed">
                  Thousands of events happening around you — from cosy book clubs
                  to rooftop socials. Your people are already there.
                </p>
              </div>



              <div className="flex gap-3 flex-wrap mt-10">
                <Link to="/events">
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-orchid text-white text-sm font-medium rounded-lg hover:bg-orchid/90 active:scale-[0.97] transition-all cursor-pointer">
                    <Compass size={15} /> Explore events
                  </button>
                </Link>
                <Link to="/events/create">
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 text-lavender text-sm font-medium rounded-lg border border-white/10 hover:bg-white/5 active:scale-[0.97] transition-all cursor-pointer">
                    <CalendarPlus size={15} /> Host one
                  </button>
                </Link>
              </div>
            </div>

            {/* Right — live event previews */}
            <div className="bg-deep-ocean border-l border-fog flex flex-col gap-3 justify-center">
              <img
                src="/cta-gather.jpg"
                alt='cta-gather'
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        </div>
      </section>
  )
}
