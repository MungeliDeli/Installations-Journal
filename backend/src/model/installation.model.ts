// src/model/installation.model.ts

import mongoose, { Schema, Document, Types } from "mongoose";

export interface IInstallationImage {
  url: string;
  key: string;
  size: number;
  uploadedAt: Date;
}

export interface IInstallation extends Document {
  customer: string;
  phone: string;
  location: string;
  reference: string;
  installedAt: Date;
  speed: number;
  notes?: string;
  rsrp?: number;
  images: IInstallationImage[];
  createdBy: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const installationImageSchema = new Schema<IInstallationImage>(
  {
    url: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    size: { type: Number, required: true },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const installationSchema = new Schema<IInstallation>(
  {
    customer: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    reference: {
      type: String,
      required: [true, "Reference is required"],
      trim: true,
      unique: true,
    },
    installedAt: {
      type: Date,
      required: [true, "Installation date is required"],
    },

    speed: {
      type: Number,
      required: [true, "Speed is required"],
    },
    notes: {
      type: String,
      trim: true,
    },
    rsrp: {
      type: Number,
    },
    images: {
      type: [installationImageSchema],
      default: [],
      validate: function (images: IInstallationImage[]) {
        return images.length <= 10; // Limit to 10 images
      },
      message: "Cannot upload more than 10 images",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Created by is required"],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

export const Installation = mongoose.model<IInstallation>(
  "Installation",
  installationSchema
);
