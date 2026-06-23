import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, ClipboardList, Edit, Trash } from 'lucide-react'

type Props = {
  id: string
  backLabel?: string
  backTo?: string
  isCreator: boolean
  isAdmin: boolean
  memberCount?: number
  requestCount?: number
  onDelete?: () => void
}

const CommunityTopBar = ({
  id,
  isCreator,
  isAdmin,
  memberCount,
  requestCount,
  onDelete,
}: Props) => {
  const navigate = useNavigate()

  return (
    <div className="bg-night/90 border-b border-stone/50 px-4 py-3 flex justify-between items-center h-14">
      {/* Left: back nav */}
      <button
        onClick={() => navigate(`/communities/${id}`)}
        className="flex items-center gap-2 text-sm text-fog hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Back to community</span>
      </button>

      {/* Right: role-gated actions */}
      {(isCreator || isAdmin) && (
        <div className="flex items-center gap-2">

          {/* Members — admin/creator */}
          <Link
            to={`/communities/${id}/members`}
            className="flex items-center gap-1.5 text-sm text-fog hover:text-white bg-stone/20 hover:bg-stone/30 px-3 py-2 rounded-lg transition-colors"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Members</span>
            {memberCount !== undefined && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-stone/50 text-[10px] text-mist font-bold">
                {memberCount}
              </span>
            )}
          </Link>

          {/* Requests — admin/owner only */}
          {isAdmin && (
            <Link
              to={`/communities/${id}/requests`}
              className="flex items-center gap-1.5 text-sm text-fog hover:text-white bg-stone/20 hover:bg-stone/30 px-3 py-2 rounded-lg transition-colors"
            >
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">Requests</span>
              {!!requestCount && requestCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orchid text-[10px] text-white font-bold">
                  {requestCount}
                </span>
              )}
            </Link>
          )}

          {/* Edit — creator only */}
          {isCreator && (
            <Link
              to={`/communities/${id}/edit`}
              className="flex items-center gap-1.5 text-sm text-lavender hover:text-lavender/80 bg-lavender/10 hover:bg-lavender/20 px-3 py-2 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </Link>
          )}

          {/* Delete — creator + handler required */}
          {isCreator && onDelete && (
            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 px-3 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <Trash className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default CommunityTopBar