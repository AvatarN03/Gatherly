import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axiosInstance";
import type { Community } from "../types";

const communitiesApi = {
  getAllCommunities: async (search?: string): Promise<Community[]> => {
    const { data } = await api.get("/communities", {
      params: {
        search,
      },
    });

    return data;
  },

  getMyCommunities: async (): Promise<Community[]> => {
    const { data } = await api.get("/communities/my");
    return data;
  },

  getCommunityById: async (id: string): Promise<Community> => {
    const { data } = await api.get(`/communities/${id}`);
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
    const { data } = await api.patch(`/communities/${id}`, updates, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  deleteCommunity: async (id: string): Promise<void> => {
    await api.delete(`/communities/${id}`);
  },

  verifyCommunity: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.get(`/communities/${id}/verify`);
    return data;
  },
};

// Hook to fetch all communities
export const useCommunitiesQuery = (search: string) => {
  return useQuery({
    queryKey: ["communities", search],
    queryFn: () => communitiesApi.getAllCommunities(search),
  });
};

// Hook to fetch a single community
export const useCommunityQuery = (id: string) => {
  return useQuery({
    queryKey: ["community", id],
    queryFn: () => communitiesApi.getCommunityById(id),
    enabled: !!id,
  });
};

export const useMyCommunityQuery = () => {
  return useQuery({
    queryKey: ["communities", "mine"],
    queryFn: () => communitiesApi.getMyCommunities(),
  });
};

// Hook to create a community
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

// Hook to update a community

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

// Hook to delete a community
export const useDeleteCommunityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => communitiesApi.deleteCommunity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
    },
  });
};
