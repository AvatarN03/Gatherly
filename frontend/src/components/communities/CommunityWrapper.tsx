import { useState } from 'react'
import { Outlet, useParams, useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/react'
import { AlertTriangle } from 'lucide-react'

import { CommunityContext } from '../../context/communityContext'

import { useCommunityQuery, useDeleteCommunityMutation } from '../../hooks/useCommunities'
import { useUserRequestQuery } from '../../hooks/useMembership'

import CommunityTopBar from './CommunityTopBar'
import DeleteCommunityModal from './DeleteCommunityModal'
import { CommunitySkeleton } from '../Skeleton'

const CommunityWrapper = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user: clerkUser } = useUser()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const { data: community, isLoading, isError } = useCommunityQuery(id || '')

  const checkMembership = community?.members?.find(
    (m) => m.userId === clerkUser?.id
  );

  const shouldFetchUserRequest =
    !!clerkUser &&
    !!community &&
    !checkMembership;

  const { data: userRequest } = useUserRequestQuery(id || '', {
    enabled: shouldFetchUserRequest,
  });

  const deleteMutation = useDeleteCommunityMutation();



  if (isLoading) return <CommunitySkeleton />

  if (isError || !community) return (
    <div className="min-h-screen bg-night flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="p-4 bg-red-500/10 rounded-full">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-mist font-medium">Community not found</p>
        <button
          onClick={() => navigate('/communities')}
          className="text-sm text-orchid hover:underline"
        >
          Back to communities
        </button>
      </div>
    </div>
  )

  const userMembership = community?.members?.find((m) => m.userId === clerkUser?.id)
  const isCreator = community.createdById === clerkUser?.id
  const isAdmin = userMembership?.role === 'ADMIN' || isCreator

  return (

    <CommunityContext.Provider value={{ community, userMembership, userRequest, isCreator, isAdmin }}>
      <div className="bg-night/40 min-h-screen">
        {clerkUser && (
          <CommunityTopBar
            id={id!}
            isCreator={isCreator}
            isAdmin={isAdmin}
            memberCount={community?._count?.members}
            requestCount={community?._count?.requests}
            onDelete={() => setShowDeleteModal(true)}
          />
        )}

        <Outlet />

        {clerkUser && (
          <DeleteCommunityModal
            communityName={community.name}
            open={showDeleteModal}
            isPending={deleteMutation.isPending}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={() =>
              deleteMutation.mutate(id!, {
                onSuccess: () => navigate('/communities'),
              })
            }
          />
        )}
      </div>
    </CommunityContext.Provider>
  )

}

export default CommunityWrapper