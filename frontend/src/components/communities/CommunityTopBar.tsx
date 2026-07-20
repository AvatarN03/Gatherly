import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, ClipboardList, Edit, Trash } from 'lucide-react'

type CommunityTopBarProps = {
  id: string
  backLabel?: string
  backTo?: string
  isMember: boolean
  isCreator: boolean
  isAdmin: boolean
  memberCount?: number
  requestCount?: number
  onDelete?: () => void
}

const CommunityTopBar = ({
  id,
  isMember,
  isCreator,
  isAdmin,
  memberCount,
  requestCount,
  onDelete,
}: CommunityTopBarProps) => {

  const navigate = useNavigate();

  const canSeeMembers = isMember || isAdmin || isCreator
  const canSeeRequests = isAdmin || isCreator
  const canSeeAnyAction = canSeeMembers || canSeeRequests || isCreator

  return (
    <div className="bg-night/90 border-b border-stone/50 px-4 py-3 flex justify-between items-center h-14">
      {/* Left: back nav */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 hover:gap-1.5 text-sm text-fog hover:text-white transition-all cursor-pointer underline-hover"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Back</span>
      </button>

      {/* Right: role-gated actions */}
      {canSeeAnyAction && (
        <div className="flex items-center gap-2">

          {/* Members — any member, admin, or creator */}
          {canSeeMembers && (
            <Link
              to={`/communities/${id}/members`}
              className="flex items-center gap-1.5 text-sm text-fog hover:text-white bg-stone/20 hover:bg-stone/30 px-3 py-2 rounded-lg transition-colors"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Members</span>
              {memberCount && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-stone/50 text-[10px] text-mist font-bold">
                  {memberCount}
                </span>
              )}
            </Link>
          )}

          {/* Requests — admin/creator only */}
          {canSeeRequests && (
            <Link
              to={`/communities/${id}/requests`}
              className="flex items-center gap-1.5 text-sm text-fog hover:text-white bg-stone/20 hover:bg-stone/30 px-3 py-2 rounded-lg transition-colors"
            >
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">Requests</span>
              {!!requestCount && (
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