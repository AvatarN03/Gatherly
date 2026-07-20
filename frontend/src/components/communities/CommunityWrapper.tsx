import { useMemo, useState } from 'react'

import { AlertTriangle } from 'lucide-react'
import { Outlet, useParams, useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/react'

import CommunityTopBar from './CommunityTopBar'
import DeleteCommunityModal from './DeleteCommunityModal'
import { CommunitySkeleton } from '../Skeleton'
import { IsEmpty } from '../IsEmpty'

import { useCommunityQuery, useDeleteCommunityMutation } from '../../hooks/useCommunities'
import { useUserRequestQuery } from '../../hooks/useMembership'

import { CommunityContext } from '../../context/communityContext'

const CommunityWrapper = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate();
  const { user: clerkUser } = useUser();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: community, isLoading, isError } = useCommunityQuery(id);

  const userMembership = useMemo(
    () => community?.members?.find((m) => m.userId === clerkUser?.id),
    [community, clerkUser]
  )

  const isAuthenticated = !!clerkUser
  const isMember = !!userMembership
  const isCreator = userMembership?.role === 'OWNER'
  const isAdmin = userMembership?.role === 'ADMIN' || isCreator;

  const shouldFetchUserRequest = !!clerkUser && !!community && !isMember

  const { data: userRequest } = useUserRequestQuery(id, {
    enabled: shouldFetchUserRequest,
  })

  const deleteMutation = useDeleteCommunityMutation()

  if (isLoading) return <CommunitySkeleton />

  if (!id || isError || !community) return (    
    <IsEmpty 
    text="Community not found" 
    href="/communities"
    link="Back to Communities"
    Icon={AlertTriangle} 
    />
  )


  return (

    <CommunityContext.Provider value={{ community, userMembership, userRequest, isCreator, isAdmin, isAuthenticated }}>
      <div className="bg-night/40 min-h-screen">
        {clerkUser && (
          <CommunityTopBar
            id={id}
            isCreator={isCreator}
            isMember={isMember}
            isAdmin={isAdmin}
            memberCount={community?._count?.members}
            requestCount={community?._count?.requests}
            onDelete={() => setShowDeleteModal(true)}
          />
        )}

        <Outlet />

        {clerkUser && isCreator && (
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