import mongoose, { Schema, Document } from "mongoose";
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  profileImage?: string;
  supervisor?: string;
  cluster?: string;
  targetInstallations?: number;
  startDate?: Date;
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
    supervisor: {
      type: String,
      default: null,
    },
    cluster: {
      type: String,
      default: null,
    },
    targetInstallations: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
