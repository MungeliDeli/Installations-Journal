// src/services/installationApi.ts

import { api } from "./api";
import type {
  CreateInstallationData,
  Installation,
  InstallationResponse,
  InstallationsResponse,
} from "../types/installation";

export const installationApi = {
  // Create a new installation with images
  create: async (
    data: CreateInstallationData
  ): Promise<InstallationResponse> => {
    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();

      // Append all text fields
      formData.append("customer", data.customer);
      formData.append("phone", data.phone);
      formData.append("location", data.location);
      formData.append("reference", data.reference);
      formData.append("installedAt", data.installedAt);
      formData.append("speed", data.speed.toString());
      formData.append("rsrp", data.rsrp.toString());

      if (data.notes) {
        formData.append("notes", data.notes);
      }

      // Append images if any
      if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      console.log("Sending installation request to backend...");
      const response = await api.post<InstallationResponse>(
        "/installations",
        formData
      );

      console.log("Backend response:", response);
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      return response.data;
    } catch (error: any) {
      console.error("API Error in installationApi.create:", error);
      console.error("Error response:", error.response);
      throw error;
    }
  },

  // Get all installations for the current user
  getAll: async (): Promise<InstallationsResponse> => {
    const response = await api.get<InstallationsResponse>("/installations");
    return response.data;
  },

  // Get a single installation by ID
  getById: async (id: string): Promise<{ installation: Installation }> => {
    const response = await api.get<{ installation: Installation }>(
      `/installations/${id}`
    );
    return response.data;
  },

  // Update an installation (no images)
  update: async (
    id: string,
    data: Partial<CreateInstallationData>
  ): Promise<InstallationResponse> => {
    const response = await api.put<InstallationResponse>(
      `/installations/${id}`,
      data
    );
    return response.data;
  },

  // Delete an installation
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
      `/installations/${id}`
    );
    return response.data;
  },
};
