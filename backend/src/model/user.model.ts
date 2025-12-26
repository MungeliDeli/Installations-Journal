import mongoose, { Schema, Document } from "mongoose";
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  profileImage?: string;
  profileImageKey?: string;
  supervisor?: string;
  cluster?: string;
  startDate?: Date;
  dailyTarget?: number;
  weeklyTarget?: number;
  monthlyTarget?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
    profileImageKey: {
      type: String,
      default: null,
    },
    supervisor: {
      type: String,
      default: null,
    },
    cluster: {
      type: String,
      default: null,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    dailyTarget: {
      type: Number,
      default: 4,
    },
    weeklyTarget: {
      type: Number,
      default: 20,
    },
    monthlyTarget: {
      type: Number,
      default: 80,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
