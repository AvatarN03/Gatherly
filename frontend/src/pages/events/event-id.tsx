import { useState } from 'react'
import { CalendarDays, LayoutGrid, UserCheck, Users } from 'lucide-react'

import EventHero from '../../components/events/EventHero'
import EventAboutTab from '../../components/events/OverViewTab'
import EventTeamTab from '../../components/events/EventTeamTab'
import Stats from '../../components/shared/Stats'

import { useEventContext } from '../../context/eventContext'

import {
  useRegisterForEventMutation,
  useUnregisterFromEventMutation,
} from '../../hooks/useEvents'

import { formatDate } from '../../lib/date'

const EventId = () => {
  const { event } = useEventContext();

  const [activeTab, setActiveTab] = useState<'about' | 'team'>('about')

  const registerMutation = useRegisterForEventMutation();
  const unregisterMutation = useUnregisterFromEventMutation();

  const members = event.members;

  const isRegistered = event._count.registrations > 0
  const isMutating = registerMutation.isPending || unregisterMutation.isPending;

  const handleJoin = () => registerMutation.mutate(event.id);
  const handleLeave = () => unregisterMutation.mutate(event.id);

  return (
    <div className="bg-night/40">
      <div
        className="px-4 py-6 relative overflow-hidden rounded-b-2xl"
        style={{
          backgroundImage: `url(${event.imageUrl || '/image_holder.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 w-full h-full bg-black/50 backdrop-blur-xs" />

        <div className="relative z-30 space-y-4">

          <EventHero
            event={event}
            isRegistered={isRegistered}
            isMutating={isMutating}
            onJoin={handleJoin}
            onLeave={handleLeave}
          />

          <Stats
            items={[
              {
                label: 'Team',
                value: members.length,
                icon: UserCheck,
              },
              {
                label: 'Registered',
                value: event._count.registrations,
                icon: Users,
              },
              {
                label: 'Posted',
                value: formatDate(event.createdAt),
                icon: CalendarDays,
                small: true,
              },
            ]}
          />

          {/* Tabs */}
          <div className="bg-lavender/75 border-4 border-cocoa rounded-xl overflow-hidden min-h-64">
            <div className="flex border-b border-orchid">
              <button
                onClick={() => setActiveTab('about')}
                className={`relative flex items-center gap-2 px-5 py-3.5 text-xs cursor-pointer tracking-widest capitalize transition-colors text-night w-full justify-center
                  ${activeTab === 'about'
                    ? 'font-bold bg-cocoa/35 border-b-2 border-deep-ocean'
                    : 'hover:text-fog hover:bg-slate'
                  }`}
              >
                <LayoutGrid className="w-4 h-4" />
                About
              </button>
              <button
                onClick={() => setActiveTab('team')}
                className={`relative flex items-center justify-center gap-2 px-5 py-3.5 text-xs cursor-pointer tracking-widest capitalize transition-colors text-night w-full
                  ${activeTab === 'team'
                    ? 'font-bold bg-cocoa/35 border-b-2 border-deep-ocean'
                    : 'hover:text-fog hover:bg-slate'
                  }`}
              >
                <Users className="w-4 h-4" />
                Team
              </button>
            </div>

            <div className="p-5">
              {activeTab === 'about' && <EventAboutTab event={event} />}
              {activeTab === 'team' && <EventTeamTab members={members} />}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default EventId