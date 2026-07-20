import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { api } from "../lib/axiosInstance";
import type { Community } from "../types";

const communitiesApi = {
  getAllCommunities: async (
    search?: string,
    page = 1,
    limit = 9,
  ): Promise<{
    communities: Community[];
    hasMore: boolean;
    nextPage: number | null;
  }> => {
    const { data } = await api.get("/communities", {
      params: { search, page, limit },
    });
    return data;
  },

  getMyCommunities: async (): Promise<Community[]> => {
    const { data } = await api.get("/communities/my");
    console.log("data from getMyCommunities:", data);
    return data;
  },

  getCommunityById: async (id: string): Promise<Community> => {
    const { data } = await api.get(`/communities/${id}`);
    console.log("data from getCommunityById:", data);
    return data;
  },

  createCommunity: async (formData: FormData): Promise<Community> => {
    const { data } = await api.post("/communities", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  updateCommunity: async (
    id: string,
    updates: FormData,
  ): Promise<Community> => {
    const { data } = await api.put(`/communities/${id}`, updates, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  deleteCommunity: async (id: string): Promise<void> => {
    await api.delete(`/communities/${id}`);
  },

  manageCommunity: async (): Promise<Community[]> => {
    const { data } = await api.get("/communities/managed");
    console.log("data from manageCommunity:", data);
    return data;
  },

  joinedCommunities: async (): Promise<Community[]> => {
    const { data } = await api.get("/communities/joined");
    console.log("data from joinedCommunities:", data);
    return data;
  },

  

  // verifyCommunity: async (id: string): Promise<{ message: string }> => {
  //   const { data } = await api.get(`/communities/${id}/verify`);
  //   return data;
  // },
};

// fetch all communities with optional search query
export const useCommunitiesInfiniteQuery = (search: string) => {
  return useInfiniteQuery({
    queryKey: ["communities", "infinite", search],
    queryFn: ({ pageParam = 1 }) =>
      communitiesApi.getAllCommunities(search, pageParam, 9),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
    initialPageParam: 1,
    retry: 2,
    retryDelay: 1000,
  });
};

// fetch a single community
export const useCommunityQuery = (id?: string) => {
  return useQuery({
    queryKey: ["community", id],
    queryFn: () => communitiesApi.getCommunityById(id!),
    enabled: !!id,
  });
};

export const useMyCommunityQuery = () => {
  return useQuery({
    queryKey: ["communities", "mine"],
    queryFn: () => communitiesApi.getMyCommunities(),
  });
};

// create a community
export const useCreateCommunityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      communitiesApi.createCommunity(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
    },
  });
};

// update a community
export const useUpdateCommunityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      communitiesApi.updateCommunity(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      queryClient.invalidateQueries({ queryKey: ["community", variables.id] });
    },
  });
};

// delete a community
export const useDeleteCommunityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => communitiesApi.deleteCommunity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
    },
  });
};

export const useManageCommunityQuery = () => {
  return useQuery({
    queryKey: ["communities", "managed"],
    queryFn: () => communitiesApi.manageCommunity(),
  });
}

export const useJoinedCommunitiesQuery = () => {
  return useQuery({
    queryKey: ["communities", "joined"],
    queryFn: () => communitiesApi.joinedCommunities(),
  });
}