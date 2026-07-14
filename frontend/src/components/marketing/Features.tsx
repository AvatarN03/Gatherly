import { GATHERLY_FEATURES } from '../../constant';

export const Features = () => {
    return (
        <section id="features" className="w-full min-h-dvh py-25 md:px-12">
            <div className="w-full flex items-center gap-4 py-8">
                {/* Left fading line */}
                <div className="flex-1 h-px bg-linear-to-r from-transparent to-orchid/70" />

                {/* Dot + Title + Dot */}
                <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-orchid/70" />
                    <h2 className="text-lavender text-3xl font-medium tracking-widest">
                        Features
                    </h2>
                    <span className="w-1.5 h-1.5 rounded-full bg-orchid/70" />
                </div>

                {/* Right fading line */}
                <div className="flex-1 h-px bg-linear-to-l from-transparent to-orchid/70" />
            </div>

            <div className="grid grid-cols md:grid-cols-12 gap-4 space-y-8">
                {GATHERLY_FEATURES.map((feature, i) => {
                    const bgColor =
                        i % 2 === 0
                            ? "bg-lavender text-night border-b-8 border-orchid"
                            : "bg-forest-teal/50 border-purple-500/20  text-mist border-b-8 border-stone";

                    const Icon = feature.icon;

                    return (
                        <div
                            key={i}
                            className={`${bgColor} ${feature.class} border-2 
         rounded-2xl p-5 flex flex-col gap-3 h-96 relative group
         hover:border-orchid/30 transition-colors duration-200`}
                        >
                            {/* Icon + title row */}
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-lg bg-orchid/10 border border-orchid/20
           flex items-center justify-center shrink-0">
                                    <Icon size={20} className="" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-medium">{feature.title}</h3>

                                </div>
                            </div>

                            {/* Image area */}
                            <div className="flex-1 rounded-lg overflow-hidden bg-stone/50 max-h-64 flex items-center justify-center">
                                <img
                                    src={feature.image}
                                    alt={feature.title}
                                    className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Description */}
                            <p className="text-base  leading-relaxed">{feature.description}</p>
                        </div>
                    );
                })}
            </div>

        </section>
    )
}
