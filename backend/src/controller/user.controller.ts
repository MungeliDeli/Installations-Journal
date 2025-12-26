import { type Request, type Response } from "express";
import { User } from "../model/user.model.js";
import {
  hashpassword,
  comparePassword,
  generatToken,
} from "../service/auth.service.js";
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} from "../utils/customErrors.js";
import { ProfileImageService } from "../service/profileImage.service.js";
import multer from "multer";

// Configure multer for profile image uploads (memory storage for S3)
const storage = multer.memoryStorage();

const fileFilter = (_req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new BadRequestError("Only image files are allowed"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export const register = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { name, email, password, phone } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists)
    throw new ConflictError("User with this email already exist ");

  const hash = await hashpassword(password);

  const user = await User.create({ name, email, password: hash, phone });
  const token = generatToken(user);

  return res.status(200).json({
    message: "User registered successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      supervisor: user.supervisor,
      cluster: user.cluster,
      startDate: user.startDate,
      dailyTarget: user.dailyTarget,
      weeklyTarget: user.weeklyTarget,
      monthlyTarget: user.monthlyTarget,
    },
  });
};

export const login = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new UnauthorizedError("Invalid Credentials");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new UnauthorizedError("Invalid Credentials");

  const token = generatToken(user);

  return res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      supervisor: user.supervisor,
      cluster: user.cluster,
      startDate: user.startDate,
      dailyTarget: user.dailyTarget,
      weeklyTarget: user.weeklyTarget,
      monthlyTarget: user.monthlyTarget,
    },
  });
};

export const getProfile = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const userId = req.user?.id;

  const user = await User.findById(userId).select("-password");
  if (!user) throw new NotFoundError("User not found");

  return res.status(200).json({
    message: "Profile retrieved successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      supervisor: user.supervisor,
      cluster: user.cluster,
      startDate: user.startDate,
      dailyTarget: user.dailyTarget,
      weeklyTarget: user.weeklyTarget,
      monthlyTarget: user.monthlyTarget,
      createdAt: user.createdAt,
    },
  });
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const userId = req.user?.id;
  const {
    name,
    email,
    phone,
    supervisor,
    cluster,
    dailyTarget,
    weeklyTarget,
    monthlyTarget,
  } = req.body;

  // Check if email is being changed and if it already exists
  if (email) {
    const query: any = { email };
    if (userId) query._id = { $ne: userId };

    const existingUser = await User.findOne(query);
    if (existingUser) {
      throw new ConflictError("Email already exists");
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      ...(name && { name }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(supervisor !== undefined && { supervisor }),
      ...(cluster !== undefined && { cluster }),
      ...(dailyTarget !== undefined && { dailyTarget }),
      ...(weeklyTarget !== undefined && { weeklyTarget }),
      ...(monthlyTarget !== undefined && { monthlyTarget }),
    },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) throw new NotFoundError("User not found");

  return res.status(200).json({
    message: "Profile updated successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      supervisor: user.supervisor,
      cluster: user.cluster,
      startDate: user.startDate,
      dailyTarget: user.dailyTarget,
      weeklyTarget: user.weeklyTarget,
      monthlyTarget: user.monthlyTarget,
    },
  });
};

export const uploadProfileImage = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const userId = req.user?.id;

  if (!userId) {
    throw new UnauthorizedError("User not authenticated");
  }

  if (!req.file) {
    throw new BadRequestError("No image file provided");
  }

  // Get current user to check for existing profile image
  const currentUser = await User.findById(userId);
  if (!currentUser) {
    throw new NotFoundError("User not found");
  }

  try {
    // Upload new profile image to S3 and delete old one if exists
    const uploadedImage = await ProfileImageService.replaceProfileImage(
      req.file.buffer,
      req.file.originalname,
      userId,
      currentUser.profileImageKey || undefined
    );

    // Update user with new profile image URL and key
    const user = await User.findByIdAndUpdate(
      userId,
      {
        profileImage: uploadedImage.url,
        profileImageKey: uploadedImage.key,
      },
      { new: true }
    ).select("-password");

    if (!user) throw new NotFoundError("User not found");

    return res.status(200).json({
      message: "Profile image uploaded successfully",
      profileImage: uploadedImage.url,
    });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw new BadRequestError("Failed to upload profile image");
  }
};

export const changePassword = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const userId = req.user?.id;
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User not found");

  const isCurrentPasswordValid = await comparePassword(
    currentPassword,
    user.password
  );
  if (!isCurrentPasswordValid) {
    throw new UnauthorizedError("Current password is incorrect");
  }

  const hashedNewPassword = await hashpassword(newPassword);

  await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

  return res.status(200).json({
    message: "Password changed successfully",
  });
};
