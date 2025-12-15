// src/routes/installation.routes.ts

import { Router } from "express";
import {
  createInstallation,
  getInstallationById,
  getInstallations,
  updateInstallation,
  deleteInstallation,
} from "../controller/installation.controller.js";
import { installationSchema } from "../validation/installation.validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

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
