// src/routes/installation.routes.ts

import { Router } from "express";
import {
  createInstallation,
  getInstallationById,
  getInstallations,
  updateInstallation,
  deleteInstallation,
  getInstallationStats,
  getDashboardStats,
} from "../controller/installation.controller.ts";
import { installationSchema } from "../validation/installation.validation.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { validate } from "../middleware/validate.ts";
import { authenticate } from "../middleware/auth.ts";
import { upload } from "../middleware/upload.ts";

const router = Router();

// All routes require authentication
router.use(authenticate);

// @route   POST /api/installations
// @desc    Create a new installation with optional images (max 10)
// @access  Private
router.post(
  "/",
  upload.array("images", 10), // Handle images first
  validate(installationSchema), // Then validate other fields
  asyncHandler(createInstallation)
);

// @route   GET /api/installations/dashboard
// @desc    Get dashboard statistics and chart data
// @access  Private
router.get("/dashboard", asyncHandler(getDashboardStats));

// @route   GET /api/installations/stats
// @desc    Get installation statistics by date range
// @access  Private
router.get("/stats", asyncHandler(getInstallationStats));

// @route   GET /api/installations
// @desc    Get all installations for the logged-in user
// @access  Private
router.get("/", asyncHandler(getInstallations));

// @route   GET /api/installations/:id
// @desc    Get a single installation by ID
// @access  Private
router.get("/:id", asyncHandler(getInstallationById));

// @route   PUT /api/installations/:id
// @desc    Update an installation (details only, not images)
// @access  Private
router.put(
  "/:id",
  validate(installationSchema),
  asyncHandler(updateInstallation)
);

// @route   DELETE /api/installations/:id
// @desc    Delete an installation (including all images)
// @access  Private
router.delete("/:id", asyncHandler(deleteInstallation));

export default router;
