import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ClipboardList, Edit, Trash, Users } from 'lucide-react'

type Props = {
  id: string
  isCreator: boolean
  isEventMember: boolean;
  isCoordinator: boolean;
  onDelete: () => void
}

const EventTopBar = ({
  id,
  isCreator,
  isEventMember,
  onDelete,
  isCoordinator,
}: Props) => {
  const navigate = useNavigate()

  const canViewManagement = isCreator || isEventMember;

  return (
    <div className="bg-night/90 border-b border-stone/50 px-4 py-3 flex justify-between items-center h-14">

      {/* Left: back nav */}
      <button
        onClick={() => navigate(`/events/${id}`)}
        className="flex items-center gap-2 text-sm text-fog hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Back to event</span>
      </button>

      {/* Right: gated actions */}
     
        <div className="flex items-center gap-2">

          {/* Assign / Remove team — creator, community admin, event team */}
          {canViewManagement && (
            <>
              <Link
                to={`/events/${id}/team`}
                className="flex items-center gap-1.5 text-sm text-fog hover:text-white bg-stone/20 hover:bg-stone/30 px-3 py-2 rounded-lg transition-colors"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Team</span>
              </Link>

              <Link
                to={`/events/${id}/registers`}
                className="flex items-center gap-1.5 text-sm text-fog hover:text-white bg-stone/20 hover:bg-stone/30 px-3 py-2 rounded-lg transition-colors"
              >
                <ClipboardList className="w-4 h-4" />
                <span className="hidden sm:inline">Registrations</span>
              </Link>
            </>
          )}

          {/* Edit — creator only */}
          {isCreator && (
            <>

            <Link
              to={`/events/${id}/edit`}
              className="flex items-center gap-1.5 text-sm text-lavender hover:text-lavender/80 bg-lavender/10 hover:bg-lavender/20 px-3 py-2 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </Link>

            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 px-3 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <Trash className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
            </>
          )}

        </div>
      
    </div>
  )
}

export default EventTopBar