export const COMMUNITY_CATEGORIES = [
  { value: 'General',       label: 'General' },
  { value: 'Technology',    label: 'Technology' },
  { value: 'Education',     label: 'Education' },
  { value: 'Health',        label: 'Health & Wellness' },
  { value: 'Sports',        label: 'Sports & Fitness' },
  { value: 'Arts',          label: 'Arts & Culture' },
  { value: 'Business',      label: 'Business & Finance' },
  { value: 'Environment',   label: 'Environment' },
  { value: 'Food',          label: 'Food & Cooking' },
  { value: 'Gaming',        label: 'Gaming' },
  { value: 'Music',         label: 'Music' },
  { value: 'Travel',        label: 'Travel' },
  { value: 'Others',        label: 'Others' },
] as const

export const EVENT_SUBCATEGORIES: Record<CommunityCategory, { value: string; label: string }[]> = {
  General: [
    { value: 'Meetup',        label: 'Meetup' },
    { value: 'Networking',    label: 'Networking' },
    { value: 'Workshop',      label: 'Workshop' },
    { value: 'Others',        label: 'Others' },
  ],
  Technology: [
    { value: 'Hackathon',     label: 'Hackathon' },
    { value: 'Conference',    label: 'Conference' },
    { value: 'Webinar',       label: 'Webinar' },
    { value: 'CodeSprint',    label: 'Code Sprint' },
    { value: 'Others',        label: 'Others' },
  ],
  Education: [
    { value: 'Seminar',       label: 'Seminar' },
    { value: 'Bootcamp',      label: 'Bootcamp' },
    { value: 'Tutoring',      label: 'Tutoring' },
    { value: 'Quiz',          label: 'Quiz & Competition' },
    { value: 'Others',        label: 'Others' },
  ],
  Health: [
    { value: 'Yoga',          label: 'Yoga & Meditation' },
    { value: 'MentalHealth',  label: 'Mental Health' },
    { value: 'Nutrition',     label: 'Nutrition & Diet' },
    { value: 'Wellness',      label: 'Wellness Camp' },
    { value: 'Others',        label: 'Others' },
  ],
  Sports: [
    { value: 'Tournament',    label: 'Tournament' },
    { value: 'Training',      label: 'Training Session' },
    { value: 'Marathon',      label: 'Marathon & Run' },
    { value: 'FriendlyMatch', label: 'Friendly Match' },
    { value: 'Others',        label: 'Others' },
  ],
  Arts: [
    { value: 'Exhibition',    label: 'Exhibition' },
    { value: 'Performance',   label: 'Live Performance' },
    { value: 'Workshop',      label: 'Art Workshop' },
    { value: 'FilmScreening', label: 'Film Screening' },
    { value: 'Others',        label: 'Others' },
  ],
  Business: [
    { value: 'Pitch',         label: 'Pitch Night' },
    { value: 'Panel',         label: 'Panel Discussion' },
    { value: 'Networking',    label: 'Networking' },
    { value: 'TradeShow',     label: 'Trade Show' },
    { value: 'Others',        label: 'Others' },
  ],
  Environment: [
    { value: 'Cleanup',       label: 'Cleanup Drive' },
    { value: 'Plantation',    label: 'Tree Plantation' },
    { value: 'Awareness',     label: 'Awareness Campaign' },
    { value: 'Recycling',     label: 'Recycling Drive' },
    { value: 'Others',        label: 'Others' },
  ],
  Food: [
    { value: 'FoodFestival',  label: 'Food Festival' },
    { value: 'CookingClass',  label: 'Cooking Class' },
    { value: 'Tasting',       label: 'Tasting Event' },
    { value: 'Bakeoff',       label: 'Bake-off' },
    { value: 'Others',        label: 'Others' },
  ],
  Gaming: [
    { value: 'LAN',           label: 'LAN Party' },
    { value: 'Esports',       label: 'Esports Tournament' },
    { value: 'BoardGames',    label: 'Board Games Night' },
    { value: 'GameJam',       label: 'Game Jam' },
    { value: 'Others',        label: 'Others' },
  ],
  Music: [
    { value: 'Concert',       label: 'Concert' },
    { value: 'OpenMic',       label: 'Open Mic' },
    { value: 'JamSession',    label: 'Jam Session' },
    { value: 'MusicWorkshop', label: 'Music Workshop' },
    { value: 'Others',        label: 'Others' },
  ],
  Travel: [
    { value: 'GroupTrip',     label: 'Group Trip' },
    { value: 'Hiking',        label: 'Hiking & Trekking' },
    { value: 'CityTour',      label: 'City Tour' },
    { value: 'Camping',       label: 'Camping' },
    { value: 'Others',        label: 'Others' },
  ],
  Others: [
    { value: 'Social',        label: 'Social Gathering' },
    { value: 'Charity',       label: 'Charity Event' },
    { value: 'Others',        label: 'Others' },
  ],
}

export type EventSubCategory = typeof EVENT_SUBCATEGORIES[CommunityCategory][number]['value']

export type CommunityCategory = typeof COMMUNITY_CATEGORIES[number]['value']