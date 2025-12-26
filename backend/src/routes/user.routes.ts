import { Router } from "express";
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  changePassword,
  upload,
} from "../controller/user.controller.ts";
import { authenticate } from "../middleware/auth.ts";
import { validate } from "../middleware/validate.ts";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "../validation/user.validate.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

const router = Router();

// Debug middleware to log requests
router.use((req, res, next) => {
  console.log(`User route accessed: ${req.method} ${req.path}`);
  next();
});

// All routes require authentication
router.use(authenticate);

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", asyncHandler(getProfile));

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put(
  "/profile",
  validate(updateProfileSchema),
  asyncHandler(updateProfile)
);

// @route   POST /api/user/upload-image
// @desc    Upload profile image
// @access  Private
router.post(
  "/upload-image",
  upload.single("profileImage"),
  asyncHandler(uploadProfileImage)
);

// @route   PUT /api/user/change-password
// @desc    Change user password
// @access  Private
router.put(
  "/change-password",
  validate(changePasswordSchema),
  asyncHandler(changePassword)
);

export default router;
