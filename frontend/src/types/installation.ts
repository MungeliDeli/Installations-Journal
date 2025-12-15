// src/types/installation.ts

export interface InstallationImage {
  url: string;
  key: string;
  size: number;
  uploadedAt: string;
}

export interface Installation {
  _id: string;
  customer: string;
  phone: string;
  location: string;
  reference: string;
  installedAt: string;
  speed: number;
  notes?: string;
  rsrp: number;
  images: InstallationImage[];
  createdBy:
    | string
    | {
        _id: string;
        name: string;
        email: string;
      };
  createdAt: string;
  updatedAt: string;
}

export interface CreateInstallationData {
  customer: string;
  phone: string;
  location: string;
  reference: string;
  installedAt: string;
  speed: number;
  notes?: string;
  rsrp: number;
  images?: File[]; // Add images field
}

export interface InstallationResponse {
  message: string;
  installation: Installation;
}

export interface InstallationsResponse {
  installations: Installation[];
  count: number;
}
