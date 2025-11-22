import { useInfiniteQuery } from "@tanstack/react-query";
import { msalInstance, getAuthConfig } from "../auth/msalInstance";
import { acquireToken } from "@one-portal/auth/utils/acquireToken";
import { fetchProjects } from "../api/client";
import { type GetProjectsRequest } from "../api/types";
import { useUserContext } from "../contexts/UserContext";
import { useState, useCallback } from "react";

const PROJECTS_PAGE_SIZE = 50; // Fetch 50 items per batch

export function useProjects() {
  const { user } = useUserContext();
  const [filters, setFilters] = useState<Partial<GetProjectsRequest>>({});

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["projects", user?.userId, filters],
    queryFn: async ({ pageParam }) => {
      if (!user?.userId) throw new Error("User ID not available");

      // Acquire token
      const accounts = msalInstance.getAllAccounts();
      const account = accounts[0];
      if (!account) throw new Error("No active account");

      const tokenResult = await acquireToken({
        msalInstance,
        account,
        scopes: getAuthConfig().scopes,
      });

      const request: GetProjectsRequest = {
        UserId: user.userId,
        LimitCount: PROJECTS_PAGE_SIZE,
        LastId: pageParam as number | null,
        ...filters,
      };

      return fetchProjects(
        tokenResult.accessToken,
        tokenResult.account.username,
        request,
      );
    },
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => {
      if (lastPage.projects.length < PROJECTS_PAGE_SIZE) return undefined;
      const lastProject = lastPage.projects[lastPage.projects.length - 1];
      return lastProject ? lastProject.id : undefined;
    },
    enabled: !!user?.userId,
  });

  // Flatten projects from all pages
  const projects = data?.pages.flatMap((page) => page.projects) || [];

  const updateFilters = useCallback(
    (newFilters: Partial<GetProjectsRequest>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    [],
  );

  return {
    projects,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    setFilters: updateFilters,
    totalCount: data?.pages[0]?.count || 0,
  };
}
