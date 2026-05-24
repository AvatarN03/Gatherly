import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axiosInstance";
import type { Membership, MembershipRequest } from "../types/community";

const membershipApi = {
  joinCommunity: async (communityId: string): Promise<MembershipRequest> => {
    const { data } = await api.post(`/memberships/${communityId}/join`);
    return data;
  },

  leaveCommunity: async (communityId: string): Promise<{ message: string }> => {
    const { data } = await api.delete(`/memberships/${communityId}/leave`);
    return data;
  },

  getMembers: async (communityId: string): Promise<Membership[]> => {
    const { data } = await api.get(`/memberships/${communityId}/members`);
    return data;
  },

  getCommunityRequests: async (communityId: string): Promise<MembershipRequest[]> => {
    const { data } = await api.get(`/memberships/${communityId}/requests`);
    return data;
  },

  handleRequest: async (
    communityId: string,
    requestId: string,
    status: "APPROVED" | "REJECTED"
  ): Promise<MembershipRequest> => {
    const { data } = await api.patch(`/memberships/${communityId}/requests/${requestId}`, {
      status,
    });
    return data;
  },
};

// Join community mutation
export const useJoinCommunityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (communityId: string) => membershipApi.joinCommunity(communityId),
    onSuccess: (_, communityId) => {
      queryClient.invalidateQueries({ queryKey: ["community", communityId] });
      queryClient.invalidateQueries({ queryKey: ["memberships", communityId] });
    },
  });
};

// Leave community mutation
export const useLeaveCommunityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (communityId: string) => membershipApi.leaveCommunity(communityId),
    onSuccess: (_, communityId) => {
      queryClient.invalidateQueries({ queryKey: ["community", communityId] });
      queryClient.invalidateQueries({ queryKey: ["memberships", communityId] });
    },
  });
};

// Get members query
export const useMembersQuery = (communityId: string) => {
  return useQuery({
    queryKey: ["memberships", communityId, "members"],
    queryFn: () => membershipApi.getMembers(communityId),
    enabled: !!communityId,
  });
};

// Get community requests query
export const useCommunityRequestsQuery = (communityId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["memberships", communityId, "requests"],
    queryFn: () => membershipApi.getCommunityRequests(communityId),
    enabled: !!communityId && enabled,
  });
};

// Handle membership request mutation
export const useHandleRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      communityId,
      requestId,
      status,
    }: {
      communityId: string;
      requestId: string;
      status: "APPROVED" | "REJECTED";
    }) => membershipApi.handleRequest(communityId, requestId, status),
    onSuccess: (_, { communityId }) => {
      queryClient.invalidateQueries({ queryKey: ["memberships", communityId, "requests"] });
      queryClient.invalidateQueries({ queryKey: ["memberships", communityId, "members"] });
      queryClient.invalidateQueries({ queryKey: ["community", communityId] });
    },
  });
};
