import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { installationApi } from "../services/installationApi";
import type { CreateInstallationData } from "../types/installation";

export const useInstallations = () => {
  return useQuery({
    queryKey: ["installations"],
    queryFn: installationApi.getAll,
  });
};

export const useInstallation = (id: string) => {
  return useQuery({
    queryKey: ["installation", id],
    queryFn: () => installationApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateInstallation = () => {
  const queryClient = useQueryClient();


  return useMutation({
    mutationFn: (data: CreateInstallationData) => installationApi.create(data),
    onSuccess: () => {
      // Invalidate and refetch installations list
      queryClient.invalidateQueries({ queryKey: ["installations"] });
    },
  });
};

export const useUpdateInstallation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateInstallationData> }) =>
      installationApi.update(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate and refetch installations list and specific installation
      queryClient.invalidateQueries({ queryKey: ["installations"] });
      queryClient.invalidateQueries({ queryKey: ["installation", id] });
    },
  });
};

export const useDeleteInstallation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => installationApi.delete(id),
    onSuccess: () => {
      // Invalidate and refetch installations list
      queryClient.invalidateQueries({ queryKey: ["installations"] });
    },
  });
};