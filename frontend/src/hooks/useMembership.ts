import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "../lib/axiosInstance";

import type {
  MemberRoleHandler,
  Membership,
  MembershipRequest,
  RequestHandelStatus,
} from "../types";

const membershipApi = {
  createJoinRequest: async (
    communityId: string,
  ): Promise<MembershipRequest> => {
    const { data } = await api.post(`/memberships/${communityId}/join`);
    return data;
  },

  leaveCommunity: async (communityId: string): Promise<{ message: string }> => {
    const { data } = await api.delete(`/memberships/${communityId}/leave`);
    return data;
  },

  withdrawRequest: async (
    communityId: string,
  ): Promise<{ message: string }> => {
    const { data } = await api.delete(`/memberships/${communityId}/withdraw`);
    return data;
  },

  getMembers: async (communityId: string): Promise<Membership[]> => {
    const { data } = await api.get(`/memberships/${communityId}/members`);
    console.log("data from getMembers:", data);
    return data;
  },

  getUserRequest: async (
    communityId: string,
  ): Promise<MembershipRequest | undefined> => {
    const { data } = await api.get(`/memberships/${communityId}/my-request`);
    console.log("data from getUserRequest:", data);
    return data;
  },

  getCommunityRequests: async (
    communityId: string,
  ): Promise<MembershipRequest[]> => {
    const { data } = await api.get(`/memberships/${communityId}/requests`);
    return data;
  },

  handleRequest: async (
    communityId: string,
    requestId: string,
    status: RequestHandelStatus,
  ): Promise<MembershipRequest> => {
    const { data } = await api.patch(
      `/memberships/${communityId}/requests/${requestId}`,
      {
        status,
      },
    );
    return data;
  },

  updateMemberRole: async (
    communityId: string,
    memberId: string,
    role: MemberRoleHandler,
  ): Promise<Membership> => {
    const { data } = await api.patch(
      `/memberships/${communityId}/members/${memberId}`,
      { role },
    );
    return data;
  },

  removeMember: async (
    communityId: string,
    memberId: string,
  ): Promise<{ message: string }> => {
    const { data } = await api.delete(
      `/memberships/${communityId}/members/${memberId}`,
    );
    return data;
  },

  getMyMembershipRequests: async () => {
    const { data } = await api.get("/memberships/requests/mine");
    console.log("check", data);
    return data;
  },

  getMyMemberships: async (): Promise<Membership[]> => {
    const { data } = await api.get("/memberships/mine");
    console.log("My Memberships:", data);
    return data;
  }
};

export const useUpdateMemberRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      communityId,
      memberId,
      role,
    }: {
      communityId: string;
      memberId: string;
      role: MemberRoleHandler;
    }) => membershipApi.updateMemberRole(communityId, memberId, role),
    onSuccess: (_, { communityId }) => {
      queryClient.invalidateQueries({
        queryKey: ["memberships", communityId, "members"],
      });
      queryClient.invalidateQueries({ queryKey: ["community", communityId] });
    },
  });
};

export const useRemoveMemberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      communityId,
      memberId,
    }: {
      communityId: string;
      memberId: string;
    }) => membershipApi.removeMember(communityId, memberId),
    onSuccess: (_, { communityId }) => {
      queryClient.invalidateQueries({
        queryKey: ["memberships", communityId, "members"],
      });
      queryClient.invalidateQueries({ queryKey: ["community", communityId] });
    },
  });
};

export const useJoinCommunityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (communityId: string) =>
      membershipApi.createJoinRequest(communityId),
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
    mutationFn: (communityId: string) =>
      membershipApi.leaveCommunity(communityId),
    onSuccess: (_, communityId) => {
      queryClient.invalidateQueries({ queryKey: ["community", communityId] });
      queryClient.invalidateQueries({ queryKey: ["memberships", communityId] });
    },
  });
};

export const useWithdrawRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (communityId: string) =>
      membershipApi.withdrawRequest(communityId),
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
export const useCommunityRequestsQuery = (
  communityId: string,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["memberships", communityId, "requests"],
    queryFn: () => membershipApi.getCommunityRequests(communityId),
    enabled: !!communityId && enabled,
  });
};

export const useUserRequestQuery = (communityId: string) => {
  return useQuery({
    queryKey: ["memberships", communityId, "my-request"],
    queryFn: () => membershipApi.getUserRequest(communityId),
    enabled: !!communityId,
  });
};

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
      queryClient.invalidateQueries({
        queryKey: ["memberships", communityId, "requests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["memberships", communityId, "members"],
      });
      queryClient.invalidateQueries({ queryKey: ["community", communityId] });
    },
  });
};

export const useMyMembershipRequestsQuery = () =>
  useQuery({
    queryKey: ["membership-requests", "mine"],
    queryFn: membershipApi.getMyMembershipRequests,
  });


  export const useMyMembershipsQuery = () =>
  useQuery({
    queryKey: ["memberships", "mine"],
    queryFn: membershipApi.getMyMemberships,
  });