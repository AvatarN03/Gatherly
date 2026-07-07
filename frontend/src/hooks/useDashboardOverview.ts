import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axiosInstance";
import type { DashboardOverviewResponse } from "../types";

const fetchDashboardOverview = async (): Promise<DashboardOverviewResponse> => {
    console.log("Dashboard Overview Fetching...");
  const { data } = await api.get("/dashboard");
  console.log("Dashboard Overview Data:", data); // Log the data to the console for debugging
  return data;
};

export const useDashboardOverview = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardOverview,
  });
};