import { type Request, type Response } from "express";
import { User } from "../model/user.model.js";
import {
  hashpassword,
  comparePassword,
  generatToken,
} from "../service/auth.service.js";
import { ConflictError, UnauthorizedError, NotFoundError, BadRequestError } from "../utils/customErrors.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user?.id;
    const uploadPath = path.join(process.cwd(), 'uploads', 'profile-images', userId);

    // Create directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `profile${ext}`);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Only image files are allowed'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
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

  return res.status(200).json({
    message: "User registered successfully",
    User: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      supervisor: user.supervisor,
      cluster: user.cluster,
      targetInstallations: user.targetInstallations,
      startDate: user.startDate,
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
      targetInstallations: user.targetInstallations,
      startDate: user.startDate,
    },
  });
};

export const getProfile = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  console.log("getProfile called for user:", req.user?.id);
  const userId = req.user?.id;

  const user = await User.findById(userId).select('-password');
  if (!user) throw new NotFoundError("User not found");

  console.log("Profile found:", user.name);
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
      targetInstallations: user.targetInstallations,
      startDate: user.startDate,
      createdAt: user.createdAt,
    },
  });
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const userId = req.user?.id;
  const { name, email, phone, supervisor, cluster, targetInstallations } = req.body;

  // Check if email is being changed and if it already exists
  if (email) {
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
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
      ...(targetInstallations !== undefined && { targetInstallations }),
    },
    { new: true, runValidators: true }
  ).select('-password');

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
      targetInstallations: user.targetInstallations,
      startDate: user.startDate,
    },
  });
};

export const uploadProfileImage = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const userId = req.user?.id;

  if (!req.file) {
    throw new BadRequestError("No image file provided");
  }

  const profileImagePath = `/uploads/profile-images/${userId}/${req.file.filename}`;

  const user = await User.findByIdAndUpdate(
    userId,
    { profileImage: profileImagePath },
    { new: true }
  ).select('-password');

  if (!user) throw new NotFoundError("User not found");

  return res.status(200).json({
    message: "Profile image uploaded successfully",
    profileImage: profileImagePath,
  });
};

export const changePassword = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const userId = req.user?.id;
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User not found");

  const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
  if (!isCurrentPasswordValid) {
    throw new UnauthorizedError("Current password is incorrect");
  }

  const hashedNewPassword = await hashpassword(newPassword);

  await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

  return res.status(200).json({
    message: "Password changed successfully",
  });
};
