// import type { ReactNode } from "react";
// import { Link } from "react-router-dom";
// import {
//   Users,
//   CalendarPlus,
//   UserCheck,
//   Ticket,
//   LayoutDashboard,
//   ShieldCheck,
//   Compass,
//   BellRing,
//   Server,
//   Database,
//   KeyRound,
//   Zap,
//   ImageIcon,
//   Cloud,
//   Code2,
//   GitBranch,
//   Smartphone,
//   MessageSquare,
//   CalendarClock,
//   BarChart3,
//   Sparkles,
//   ArrowRight,
// } from "lucide-react";

// /* ------------------------------------------------------------------ */
// /*  Shared primitives                                                  */
// /* ------------------------------------------------------------------ */

// const Section = ({
//   id,
//   className = "",
//   children,
// }: {
//   id?: string;
//   className?: string;
//   children: ReactNode;
// }) => (
//   <section
//     id={id}
//     className={`border-t border-slate/10 dark:border-mist/10 ${className}`}
//   >
//     <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">{children}</div>
//   </section>
// );

// const Eyebrow = ({ children }: { children: ReactNode }) => (
//   <p className="font-display text-xs tracking-[0.25em] uppercase text-orchid mb-4">
//     {children}
//   </p>
// );

// const Card = ({
//   children,
//   className = "",
// }: {
//   children: ReactNode;
//   className?: string;
// }) => (
//   <div
//     className={`rounded-2xl border border-slate/10 dark:border-mist/10 bg-white dark:bg-deep-ocean p-6 transition-all duration-300 hover:border-orchid/40 hover:shadow-[0_0_0_1px_rgba(168,85,247,0.15)] ${className}`}
//   >
//     {children}
//   </div>
// );

// const IconBadge = ({ children }: { children: ReactNode }) => (
//   <div className="w-11 h-11 rounded-xl bg-orchid/10 text-orchid flex items-center justify-center mb-4">
//     {children}
//   </div>
// );

// /* ------------------------------------------------------------------ */
// /*  Data                                                               */
// /* ------------------------------------------------------------------ */

// const FEATURES = [
//   {
//     icon: Users,
//     title: "Community Management",
//     body: "Create and manage communities with role-based access.",
//   },
//   {
//     icon: CalendarPlus,
//     title: "Event Creation",
//     body: "Plan and organize online or offline events.",
//   },
//   {
//     icon: UserCheck,
//     title: "Membership Requests",
//     body: "Approve or reject members before they join a community.",
//   },
//   {
//     icon: Ticket,
//     title: "Event Registration",
//     body: "Members register for events in a couple of taps.",
//   },
//   {
//     icon: LayoutDashboard,
//     title: "Organizer Dashboard",
//     body: "Monitor events, members, and registrations in one place.",
//   },
//   {
//     icon: ShieldCheck,
//     title: "Role-Based Permissions",
//     body: "Owner, Admin, Moderator, and Member roles, clearly scoped.",
//   },
//   {
//     icon: Compass,
//     title: "Event Discovery",
//     body: "Browse communities and upcoming events near you.",
//   },
//   {
//     icon: BellRing,
//     title: "Automated Notifications",
//     body: "Background email updates for registrations and approvals, powered by Inngest.",
//   },
// ];

// const STACK_GROUPS: { label: string; icon: typeof Code2; items: string[] }[] = [
//   { label: "Frontend", icon: Code2, items: ["React", "TypeScript", "Tailwind CSS", "Vite", "TanStack Query", "React Router"] },
//   { label: "Backend", icon: Server, items: ["Node.js", "Express.js"] },
//   { label: "Database", icon: Database, items: ["PostgreSQL", "Prisma ORM"] },
//   { label: "Authentication", icon: KeyRound, items: ["Clerk"] },
//   { label: "Background Jobs", icon: Zap, items: ["Inngest"] },
//   { label: "Image Management", icon: ImageIcon, items: ["ImageKit"] },
//   { label: "Deployment", icon: Cloud, items: ["Vercel", "Render"] },
// ];

// const STEPS = [
//   { title: "Create a Community", body: "Set it up and define its purpose in minutes." },
//   { title: "Invite Members", body: "Bring people in and start building your circle." },
//   { title: "Approve Requests", body: "Review membership requests before they join." },
//   { title: "Create Events", body: "Plan gatherings, online or in person." },
//   { title: "Members Register", body: "People reserve their spot with one click." },
//   { title: "Stay Updated", body: "Automated notifications keep everyone informed." },
// ];

// const WHY = [
//   { icon: KeyRound, title: "Secure Authentication", body: "Powered by Clerk." },
//   { icon: Server, title: "Modern Backend", body: "Express, Prisma, and PostgreSQL." },
//   { icon: Zap, title: "Event-Driven Automation", body: "Background jobs run on Inngest." },
//   { icon: Smartphone, title: "Responsive Experience", body: "Built for desktop and mobile." },
// ];

// const FUTURE = [
//   { icon: BellRing, title: "Real-Time Notifications" },
//   { icon: MessageSquare, title: "Community Chat" },
//   { icon: CalendarClock, title: "Calendar Integration" },
//   { icon: BarChart3, title: "Event Analytics" },
//   { icon: Smartphone, title: "Mobile Application" },
//   { icon: Sparkles, title: "AI-Powered Event Recommendations" },
// ];

// /* ------------------------------------------------------------------ */
// /*  Signature graphic — a small constellation of joining nodes         */
// /*  (the visual thesis: individuals connecting into one community)     */
// /* ------------------------------------------------------------------ */

// const Constellation = () => (
//   <svg
//     viewBox="0 0 320 80"
//     className="w-64 md:w-80 h-auto mx-auto text-orchid"
//     aria-hidden="true"
//   >
//     <g stroke="currentColor" strokeWidth="1" opacity="0.35">
//       <line x1="30" y1="40" x2="100" y2="20" />
//       <line x1="30" y1="40" x2="100" y2="60" />
//       <line x1="100" y1="20" x2="160" y2="40" />
//       <line x1="100" y1="60" x2="160" y2="40" />
//       <line x1="160" y1="40" x2="230" y2="18" />
//       <line x1="160" y1="40" x2="230" y2="62" />
//       <line x1="230" y1="18" x2="290" y2="40" />
//       <line x1="230" y1="62" x2="290" y2="40" />
//     </g>
//     {[
//       [30, 40, 0],
//       [100, 20, 0.4],
//       [100, 60, 0.8],
//       [160, 40, 1.2],
//       [230, 18, 0.6],
//       [230, 62, 1],
//       [290, 40, 0.2],
//     ].map(([cx, cy, delay], i) => (
//       <circle
//         key={i}
//         cx={cx}
//         cy={cy}
//         r={i === 3 ? 6 : 4.5}
//         fill="currentColor"
//         className="animate-pulse"
//         style={{ animationDelay: `${delay}s` }}
//       />
//     ))}
//   </svg>
// );


// export default function About() {
//   return (
//     <main className="bg-night/40 text-fog ">

//       <Section className="border-t-0">
//         <div className="text-center max-w-3xl mx-auto">
//           <Eyebrow>About Gatherly</Eyebrow>
//           <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight leading-[1.1]">
//             Community management,
//             <br />
//             <span className="text-orchid">built for people who gather.</span>
//           </h1>
//           <p className="mt-6 text-base md:text-lg text-mist/70 leading-relaxed">
//             Gatherly is a community-driven event management platform where people
//             create communities, organize events, manage memberships, and
//             collaborate through secure role-based access.
//           </p>
//         </div>
//         <div className="mt-14">
//           <Constellation />
//         </div>
//       </Section>

//       <Section id="features">
//         <Eyebrow>Core Features</Eyebrow>
//         <h2 className="font-display text-2xl md:text-3xl font-semibold max-w-xl mb-12">
//           Everything an organizer needs, nothing they don't.
//         </h2>
//         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
//           {FEATURES.map(({ icon: Icon, title, body }) => (
//             <Card key={title}>
//               <IconBadge>
//                 <Icon className="w-5 h-5" />
//               </IconBadge>
//               <h3 className="font-medium text-slate dark:text-mist mb-1.5">
//                 {title}
//               </h3>
//               <p className="text-sm text-slate/60 dark:text-mist/60 leading-relaxed">
//                 {body}
//               </p>
//             </Card>
//           ))}
//         </div>
//       </Section>

//       {/* ---------------- How Gatherly Works ---------------- */}
//       <Section id="htw">
//         <Eyebrow>How It Works</Eyebrow>
//         <h2 className="font-display text-2xl md:text-3xl font-semibold max-w-xl mb-14">
//           From first invite to the next event, in six steps.
//         </h2>

//         <div className="relative">
//           {/* connecting line — desktop only */}
//           <div className="hidden lg:block absolute top-5 left-0 right-0 h-px bg-slate/15 dark:bg-mist/15" />
//           <ol className="grid sm:grid-cols-2 lg:grid-cols-6 gap-x-6 gap-y-10">
//             {STEPS.map((step, i) => (
//               <li key={step.title} className="relative">
//                 <div className="relative z-10 w-10 h-10 rounded-full bg-orchid text-white flex items-center justify-center font-display text-sm font-semibold mb-4">
//                   {i + 1}
//                 </div>
//                 <h3 className="font-medium text-slate dark:text-mist mb-1.5">
//                   {step.title}
//                 </h3>
//                 <p className="text-sm text-slate/60 dark:text-mist/60 leading-relaxed">
//                   {step.body}
//                 </p>
//               </li>
//             ))}
//           </ol>
//         </div>
//       </Section>

//       {/* ---------------- Why Gatherly ---------------- */}
//       <Section>
//         <Eyebrow>Why Gatherly</Eyebrow>
//         <h2 className="font-display text-2xl md:text-3xl font-semibold max-w-xl mb-12">
//           A dependable foundation underneath a simple experience.
//         </h2>
//         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
//           {WHY.map(({ icon: Icon, title, body }) => (
//             <Card key={title}>
//               <IconBadge>
//                 <Icon className="w-5 h-5" />
//               </IconBadge>
//               <h3 className="font-medium text-slate dark:text-mist mb-1.5">
//                 {title}
//               </h3>
//               <p className="text-sm text-slate/60 dark:text-mist/60 leading-relaxed">
//                 {body}
//               </p>
//             </Card>
//           ))}
//         </div>
//       </Section>

//       {/* ---------------- Technology Stack ---------------- */}
//       <Section>
//         <Eyebrow>Technology Stack</Eyebrow>
//         <h2 className="font-display text-2xl md:text-3xl font-semibold max-w-xl mb-12">
//           Built with a modern, production-grade stack.
//         </h2>
//         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
//           {STACK_GROUPS.map(({ label, icon: Icon, items }) => (
//             <Card key={label}>
//               <div className="flex items-center gap-2 mb-4">
//                 <Icon className="w-4 h-4 text-orchid" />
//                 <span className="text-xs tracking-wide uppercase text-slate/50 dark:text-mist/50">
//                   {label}
//                 </span>
//               </div>
//               <ul className="space-y-1.5">
//                 {items.map((item) => (
//                   <li
//                     key={item}
//                     className="text-sm text-slate dark:text-mist"
//                   >
//                     {item}
//                   </li>
//                 ))}
//               </ul>
//             </Card>
//           ))}
//         </div>
//       </Section>

//       {/* ---------------- Future Plans ---------------- */}
//       <Section>
//         <Eyebrow>What's Next</Eyebrow>
//         <h2 className="font-display text-2xl md:text-3xl font-semibold max-w-xl mb-12">
//           Gatherly is still growing.
//         </h2>
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {FUTURE.map(({ icon: Icon, title }) => (
//             <Card
//               key={title}
//               className="flex items-center gap-4 hover:border-orchid/40"
//             >
//               <div className="w-10 h-10 shrink-0 rounded-lg bg-forest-teal/10 text-forest-teal dark:text-lavender flex items-center justify-center">
//                 <Icon className="w-5 h-5" />
//               </div>
//               <span className="font-medium text-slate dark:text-mist">
//                 {title}
//               </span>
//             </Card>
//           ))}
//         </div>
//       </Section>

//       {/* ---------------- About the Developer ---------------- */}
//       <Section>
//         <Card className="max-w-2xl mx-auto flex items-center gap-5 p-7">
//           <div className="w-14 h-14 shrink-0 rounded-full bg-orchid/15 text-orchid flex items-center justify-center font-display text-lg font-semibold">
//             PN
//           </div>
//           <div>
//             <h3 className="font-medium text-slate dark:text-mist">
//               Prashanth Naidu
//             </h3>
//             <p className="text-xs text-orchid mb-2">Full Stack Developer</p>
//             <p className="text-sm text-slate/65 dark:text-mist/65 leading-relaxed">
//               I enjoy building scalable web applications that combine intuitive
//               user experiences with robust backend architecture. Gatherly was
//               developed as a portfolio project to solve real-world community
//               and event management challenges while exploring modern
//               full-stack technologies.
//             </p>
//           </div>
//         </Card>
//       </Section>

//       {/* ---------------- CTA ---------------- */}
//       <Section className="pb-28">
//         <div className="rounded-3xl bg-night dark:bg-deep-ocean text-mist px-8 py-16 md:py-20 text-center relative overflow-hidden">
//           <GitBranch className="w-6 h-6 text-orchid mx-auto mb-6" aria-hidden="true" />
//           <h2 className="font-display text-2xl md:text-4xl font-semibold mb-4">
//             Bring your people together.
//           </h2>
//           <p className="text-mist/60 max-w-md mx-auto mb-9">
//             Explore what other communities are building, or start your own in
//             a couple of minutes.
//           </p>
//           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//             <Link
//               to="/communities"
//               className="w-full sm:w-auto px-6 py-3 rounded-xl border border-mist/20 text-mist hover:border-mist/40 transition-colors text-sm font-medium"
//             >
//               Explore Communities
//             </Link>
//             <Link
//               to="/communities/new"
//               className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orchid text-white hover:bg-orchid/90 transition-colors text-sm font-medium flex items-center justify-center gap-2"
//             >
//               Create Your First Community
//               <ArrowRight className="w-4 h-4" />
//             </Link>
//           </div>
//         </div>
//       </Section>
//     </main>
//   );
// }


import { Link } from "react-router-dom";
import {
  ArrowRight,
  GitBranch,
} from "lucide-react";
import { Aboutapproach, Aboutgoals, Aboutvalues } from "../../constant";

export default function About() {



  return (
    <main className="bg-night/40 text-fog">
      {/* Hero Section */}
      <section className="border-t-0 border-slate/10 dark:border-mist/10">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <p className="font-display text-xs tracking-[0.25em] uppercase text-orchid mb-4">
              About Gatherly
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight leading-[1.1]">
              Community management,
              <br />
              <span className="text-orchid">built for people who gather.</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-mist/70 leading-relaxed">
              Gatherly is a community-driven event management platform where people
              create communities, organize events, manage memberships, and
              collaborate through secure role-based access.
            </p>
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
        </div>
      </section>

      {/* Core Values Section */}
      <section className="border-t border-mist/10">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <p className="font-display text-xs tracking-[0.25em] uppercase text-orchid mb-4">
            Our Philosophy
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold max-w-xl mb-12">
            What drives everything we build.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Aboutvalues.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-mist/10 bg-deep-ocean p-6 transition-all duration-300 hover:border-orchid/40 hover:shadow-[0_0_0_1px_rgba(168,85,247,0.15)]"
              >
                <div className="w-11 h-11 rounded-xl bg-orchid/10 text-orchid flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-medium text-mist mb-1.5">
                  {title}
                </h3>
                <p className="text-sm text-mist/60 leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Achieve It Section */}
      <section className="border-t border-mist/10">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <p className="font-display text-xs tracking-[0.25em] uppercase text-orchid mb-4">
            How We Achieve It
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold max-w-xl mb-12">
            Technology that makes community management effortless.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Aboutapproach.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-mist/10 bg-deep-ocean p-6 transition-all duration-300 hover:border-orchid/40 hover:shadow-[0_0_0_1px_rgba(168,85,247,0.15)]"
              >
                <div className="w-11 h-11 rounded-xl bg-orchid/10 text-orchid flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-medium text-mist mb-1.5">
                  {title}
                </h3>
                <p className="text-sm text-mist/60 leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Goals Section */}
      <section className="border-t border-mist/10">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <p className="font-display text-xs tracking-[0.25em] uppercase text-orchid mb-4">
            Our Vision
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold max-w-xl mb-12">
            Where we're heading.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Aboutgoals.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-mist/10 bg-deep-ocean p-6 transition-all duration-300 hover:border-orchid/40 hover:shadow-[0_0_0_1px_rgba(168,85,247,0.15)]"
              >
                <div className="w-11 h-11 rounded-xl bg-orchid/10 text-orchid flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-medium text-mist mb-1.5">
                  {title}
                </h3>
                <p className="text-sm text-mist/60 leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="border-t border-mist/10">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-2xl mx-auto rounded-2xl border border-mist/10 bg-deep-ocean p-7 transition-all duration-300 hover:border-orchid/40 hover:shadow-[0_0_0_1px_rgba(168,85,247,0.15)] flex items-center gap-5">
            <div className="w-14 h-14 shrink-0 rounded-full bg-orchid/15 text-orchid flex items-center justify-center font-display text-lg font-semibold">
              PN
            </div>
            <div>
              <h3 className="font-medium text-mist">
                Prashanth Naidu
              </h3>
              <p className="text-xs text-orchid mb-2">Full Stack Developer</p>
              <p className="text-sm text-mist/60 leading-relaxed">
                I enjoy building scalable web applications that combine intuitive
                user experiences with robust backend architecture. Gatherly was
                developed as a portfolio project to solve real-world community
                and event management challenges while exploring modern
                full-stack technologies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate/10 dark:border-mist/10 pb-28">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="rounded-3xl bg-night dark:bg-deep-ocean text-mist px-8 py-16 md:py-20 text-center relative overflow-hidden">
            <GitBranch className="w-6 h-6 text-orchid mx-auto mb-6" aria-hidden="true" />
            <h2 className="font-display text-2xl md:text-4xl font-semibold mb-4">
              Bring your people together.
            </h2>
            <p className="text-mist/60 max-w-md mx-auto mb-9">
              Explore what other communities are building, or start your own in
              a couple of minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/communities"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-mist/20 text-mist hover:border-mist/40 transition-colors text-sm font-medium"
              >
                Explore Communities
              </Link>
              <Link
                to="/communities/new"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orchid text-white hover:bg-orchid/90 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                Create Your First Community
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}