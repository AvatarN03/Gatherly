import {
  Users,
  Calendar,
  Ticket,
  Shield,
  UserPlus,
  Search,
  LayoutDashboard,
  Crown,
  ShieldCheck,
  Clock,
  UserCheck,
  UserX,
  Mic2,
  HandHelping,
  Bell,
  Target,
  Lightbulb,
  MessageSquare,
  CalendarClock,
  BarChart3,
  Rocket,
  Smartphone,
  Zap,
  Server,
  Home,
  UsersRound,
  FolderKanban,
  Compass,
  CalendarRange,
  ClipboardCheck,
  Inbox,
} from "lucide-react";

import type {  CreateEvent, MemberRoleHandler, NavSection } from "../types";


export const COMMUNITY_CATEGORIES = [
  { value: "General", label: "General" },
  { value: "Technology", label: "Technology" },
  { value: "Education", label: "Education" },
  { value: "Health", label: "Health & Wellness" },
  { value: "Sports", label: "Sports & Fitness" },
  { value: "Arts", label: "Arts & Culture" },
  { value: "Business", label: "Business & Finance" },
  { value: "Environment", label: "Environment" },
  { value: "Food", label: "Food & Cooking" },
  { value: "Gaming", label: "Gaming" },
  { value: "Music", label: "Music" },
  { value: "Travel", label: "Travel" },
  { value: "Others", label: "Others" },
] as const;

export type CommunityCategory = (typeof COMMUNITY_CATEGORIES)[number]["value"];

export const EVENT_SUBCATEGORIES: Record<
  CommunityCategory,
  { value: string; label: string }[]
> = {
  General: [
    { value: "Meetup", label: "Meetup" },
    { value: "Networking", label: "Networking" },
    { value: "Workshop", label: "Workshop" },
    { value: "Others", label: "Others" },
  ],
  Technology: [
    { value: "Hackathon", label: "Hackathon" },
    { value: "Conference", label: "Conference" },
    { value: "Webinar", label: "Webinar" },
    { value: "CodeSprint", label: "Code Sprint" },
    { value: "Others", label: "Others" },
  ],
  Education: [
    { value: "Seminar", label: "Seminar" },
    { value: "Bootcamp", label: "Bootcamp" },
    { value: "Tutoring", label: "Tutoring" },
    { value: "Quiz", label: "Quiz & Competition" },
    { value: "Others", label: "Others" },
  ],
  Health: [
    { value: "Yoga", label: "Yoga & Meditation" },
    { value: "MentalHealth", label: "Mental Health" },
    { value: "Nutrition", label: "Nutrition & Diet" },
    { value: "Wellness", label: "Wellness Camp" },
    { value: "Others", label: "Others" },
  ],
  Sports: [
    { value: "Tournament", label: "Tournament" },
    { value: "Training", label: "Training Session" },
    { value: "Marathon", label: "Marathon & Run" },
    { value: "FriendlyMatch", label: "Friendly Match" },
    { value: "Others", label: "Others" },
  ],
  Arts: [
    { value: "Exhibition", label: "Exhibition" },
    { value: "Performance", label: "Live Performance" },
    { value: "Workshop", label: "Art Workshop" },
    { value: "FilmScreening", label: "Film Screening" },
    { value: "Others", label: "Others" },
  ],
  Business: [
    { value: "Pitch", label: "Pitch Night" },
    { value: "Panel", label: "Panel Discussion" },
    { value: "Networking", label: "Networking" },
    { value: "TradeShow", label: "Trade Show" },
    { value: "Others", label: "Others" },
  ],
  Environment: [
    { value: "Cleanup", label: "Cleanup Drive" },
    { value: "Plantation", label: "Tree Plantation" },
    { value: "Awareness", label: "Awareness Campaign" },
    { value: "Recycling", label: "Recycling Drive" },
    { value: "Others", label: "Others" },
  ],
  Food: [
    { value: "FoodFestival", label: "Food Festival" },
    { value: "CookingClass", label: "Cooking Class" },
    { value: "Tasting", label: "Tasting Event" },
    { value: "Bakeoff", label: "Bake-off" },
    { value: "Others", label: "Others" },
  ],
  Gaming: [
    { value: "LAN", label: "LAN Party" },
    { value: "Esports", label: "Esports Tournament" },
    { value: "BoardGames", label: "Board Games Night" },
    { value: "GameJam", label: "Game Jam" },
    { value: "Others", label: "Others" },
  ],
  Music: [
    { value: "Concert", label: "Concert" },
    { value: "OpenMic", label: "Open Mic" },
    { value: "JamSession", label: "Jam Session" },
    { value: "MusicWorkshop", label: "Music Workshop" },
    { value: "Others", label: "Others" },
  ],
  Travel: [
    { value: "GroupTrip", label: "Group Trip" },
    { value: "Hiking", label: "Hiking & Trekking" },
    { value: "CityTour", label: "City Tour" },
    { value: "Camping", label: "Camping" },
    { value: "Others", label: "Others" },
  ],
  Others: [
    { value: "Social", label: "Social Gathering" },
    { value: "Charity", label: "Charity Event" },
    { value: "Others", label: "Others" },
  ],
};
export type EventSubCategory =
  (typeof EVENT_SUBCATEGORIES)[CommunityCategory][number]["value"];

export const HomeNavLinks = [
  {
    name:"Home",
    title:"Home",
    link:"/#home",
    classes:"hidden lg:block"
  },
  {
    name:"Features",
    title:"Features",
    link:"/#features",
    classes:"hidden lg:block"
  },
  {
    name:"HTW",
    title:"How it Works",
    link:"/#htw",
    classes:"hidden lg:block"
  },
  {
    name:"About",
    link:"/about",
  },
  {
    name:"Contact",
    link:"/contact",
  },
]

export const GATHERLY_FEATURES = [
  {
    title: "Community Management",
    description:
      "Create, manage, and grow communities with role-based access control and member management.",
    icon: Users,
    image: "/features/community.svg",
    class: "col-span-12 md:col-span-7",
  },
  {
    title: "Event Creation",
    description:
      "Organize online and offline events with detailed event information and scheduling.",
    icon: Calendar,
    image: "/features/team-collab.svg",
    class: "col-span-12 md:col-span-5",
  },
  {
    title: "Event Registration",
    description:
      "Allow users to register for events and track attendance seamlessly.",
    icon: Ticket,
    image: "/features/event-plan.svg",
    class: "col-span-12 md:col-span-5",
  },
  {
    title: "Membership Requests",
    description:
      "Handle join requests, approvals, and community participation efficiently.",
    icon: UserPlus,
    image: "/features/membership.svg",
    class: "col-span-12 md:col-span-7",
  },
  {
    title: "Automated Notifications",
    description:
      "Keep members informed with automated email notifications for membership requests, approvals, registrations, and upcoming events powered by Inngest.",
    icon: Bell,
    image: "/features/verify.svg",
    class: "col-span-12 md:col-span-6",
  },
  {
    title: "Role-Based Permissions",
    description:
      "Assign admin, moderator, and member roles with customized permissions.",
    icon: Shield,
    image: "/features/role.svg",
    class: "col-span-12 md:col-span-6",
  },
  {
    title: "Event Discovery",
    description:
      "Browse and discover communities and events based on interests.",
    icon: Search,
    image: "/features/discover.svg",
    class: "col-span-12 md:col-span-4",
  },
  {
    title: "Organizer Dashboard",
    description:
      "Monitor communities, events, registrations, and engagement from one place.",
    icon: LayoutDashboard,
    image: "/features/dashboard.svg",
    class: "col-span-12 md:col-span-8",
  },
];

export const steps = [
  {
    icon: "🏡",
    title: "Create your space",
    desc: "Set up your community in minutes with a name, purpose, and vibe.",
    side: "left",
    position: "top-[15%]",
  },
  {
    icon: "📅",
    title: "Host events",
    desc: "Plan and publish events your members will actually show up for.",
    side: "right",
    position: "top-[42%]",
  },
  {
    icon: "🤝",
    title: "Grow together",
    desc: "Watch connections deepen as your community finds its rhythm.",
    side: "left",
    position: "top-[68%]",
  },
];

export const SAMPLE_EVENTS = [
  {
    emoji: "🎨",
    title: "Sunday Sketch Club",
    meta: "Tomorrow · 10:00 AM · 14 going",
    free: true,
    price: "",
  },
  {
    emoji: "🎵",
    title: "Rooftop Jazz Night",
    meta: "Sat, 7 PM · 38 going",
    free: false,
    price: "₹199",
  },
  {
    emoji: "📚",
    title: "Book Club — July pick",
    meta: "Sun, 4 PM · 9 going",
    free: true,
    price: "",
  },
  {
    emoji: "🏃",
    title: "Morning Run Group",
    meta: "Every Mon · 6:30 AM · 22 going",
    free: true,
    price: "",
  },
];

export const SKELETON_COUNT = 9;

export const inputClass =
  "w-full px-4 py-2.5 bg-slate-800 border border-fog/20 rounded-lg text-mist placeholder-fog/40 text-sm focus:outline-none focus:border-lavender transition-colors";

export const ROLE_CONFIG = {
  OWNER: {
    label: "Owner",
    icon: Crown,
    className: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  },
  ADMIN: {
    label: "Admin",
    icon: ShieldCheck,
    className: "text-blue-400  bg-blue-400/10  border-blue-400/20",
  },
  MEMBER: {
    label: "Member",
    icon: Users,
    className: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
} as const;

export const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    className: "text-amber-400  bg-amber-400/10  border-amber-400/20",
  },
  APPROVED: {
    label: "Approved",
    icon: UserCheck,
    className: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
  REJECTED: {
    label: "Rejected",
    icon: UserX,
    className: "text-red-400    bg-red-400/10    border-red-400/20",
  },
} as const;

export const EVENT_ROLE_BADGES = {
  HOST: {
    label: "Host",
    icon: Crown,
    className: "text-amber-300 bg-amber-400/10 border-amber-400/20",
  },
  SPEAKER: {
    label: "Speaker",
    icon: Mic2,
    className: "text-sky-300 bg-sky-400/10 border-sky-400/20",
  },
  COORDINATOR: {
    label: "Coordinator",
    icon: Users,
    className: "text-lavender bg-orchid/10 border-orchid/20",
  },
  VOLUNTEER: {
    label: "Volunteer",
    icon: HandHelping,
    className: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
  },
} as const;

export const SUBJECTS = [
  "General Inquiry",
  "Bug Report",
  "Feature Request",
  "Community Support",
  "Event Issue",
  "Account Issue",
  "Feedback",
  "Partnership",
  "Other",
];

export const PRIORITIES = ["Low", "Medium", "High"];

export const Aboutvalues = [
  {
    icon: Users,
    title: "Community First",
    body: "Every feature is designed to bring people together and foster meaningful connections.",
  },
  {
    icon: Target,
    title: "Purpose-Driven",
    body: "We build tools that serve real community needs, not just feature checklists.",
  },
  {
    icon: Lightbulb,
    title: "Simple & Intuitive",
    body: "Powerful functionality wrapped in an experience that anyone can use.",
  },
];

export const Aboutapproach = [
  {
    icon: Server,
    title: "Modern Architecture",
    body: "Built with Node.js, Express, and PostgreSQL for reliability and scalability.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by Design",
    body: "Clerk authentication and role-based permissions keep communities safe.",
  },
  {
    icon: Zap,
    title: "Event-Driven",
    body: "Background jobs via Inngest handle notifications and automation seamlessly.",
  },
  {
    icon: Smartphone,
    title: "Responsive Experience",
    body: "Works flawlessly on desktop, tablet, and mobile devices.",
  },
];

// What we're building towards
export const Aboutgoals = [
  {
    icon: MessageSquare,
    title: "Real-Time Engagement",
    body: "Live chat and instant notifications to keep communities active.",
  },
  {
    icon: CalendarClock,
    title: "Smart Scheduling",
    body: "Calendar integrations and smart event recommendations.",
  },
  {
    icon: BarChart3,
    title: "Community Analytics",
    body: "Insights to help organizers understand and grow their communities.",
  },
  {
    icon: Rocket,
    title: "Mobile Experience",
    body: "Native mobile apps for iOS and Android coming soon.",
  },
];

export const sections: NavSection[] = [
  {
    key: "home",
    icon: Home,
    title: "Overview",
    href: "/dashboard",
    subItems: [
      {
        title: "Dashboard",
        path: "/dashboard",
        end: true,
        icon: LayoutDashboard,
      },
    ],
  },
  {
    key: "Communities",
    icon: UsersRound,
    title: "Communities",
    subItems: [
      { title: "My", path: "/communities/my", end: true, icon: FolderKanban },
      {
        title: "Managed",
        path: "/communities/managed",
        end: true,
        icon: ShieldCheck,
      },
      {
        title: "Joined",
        path: "/communities/joined",
        end: true,
        icon: UserCheck,
      },
      { title: "Browse", path: "/communities", end: true, icon: Compass },
    ],
  },
  {
    key: "Events",
    icon: CalendarRange,
    title: "Events",
    subItems: [
      { title: "My", path: "/events/my", end: true, icon: Calendar },
      {
        title: "Registered",
        path: "/events/registered",
        end: true,
        icon: Ticket,
      },
      {
        title: "Assigned",
        path: "/events/assigned",
        end: true,
        icon: ClipboardCheck,
      },
      { title: "Browse", path: "/events", end: true, icon: Search },
    ],
  },
  {
    key: "Admin",
    icon: Inbox,
    title: "Admin",
    subItems: [
      {
        title: "Community Requests",
        path: "/dashboard/communities-requests",
        icon: Inbox,
      },
    ],
  },
];

export const COMMUNITY_ASSIGNABLE_ROLES = ['ADMIN', 'MEMBER'] as const satisfies readonly MemberRoleHandler[]


export const INITIAL_FORM: Partial<CreateEvent> = {
  title: "",
  date: "",
  time: "",
  location: "",
  description: "",
  communityId: "",
  category: "General",
  subCategory: "",
};

export const ORGANISER_BADGE = {
  label: "Organiser",
  icon: Crown,
  className: "text-purple-300 bg-purple-400/10 border-purple-400/20",
};