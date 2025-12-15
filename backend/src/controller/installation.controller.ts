// src/controller/installation.controller.ts

import { Installation } from "../model/installation.model.js";
import { type Request, type Response } from "express";
import { NotFoundError, ConflictError } from "../utils/customErrors.js";
import { ImageService } from "../service/image.service.js";

// Extended Request interface with user
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const createInstallation = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  const {
    customer,
    location,
    reference,
    installedAt,
    phone,
    speed,
    notes,
    rsrp,
  } = req.body;

  // Validate reference field for S3 folder naming
  if (!reference || typeof reference !== 'string' || reference.trim().length === 0) {
    return res.status(400).json({
      message: "Reference field is required and must be a non-empty string",
    });
  }

  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized: User not authenticated",
    });
  }

  const files = req.files as Express.Multer.File[];

  // Validate number of images
  if (files && files.length > 10) {
    return res.status(400).json({
      message: "Maximum 10 images allowed",
    });
  }

  // Process and upload images if any
  let uploadedImages = [];

  try {
    if (files && files.length > 0) {
      console.log(`Processing ${files.length} images...`);

      const uploadPromises = files.map(async (file) => {
        const result = await ImageService.processAndUpload(
          file.buffer,
          file.originalname,
          reference
        );
        return {
          url: result.url,
          key: result.key,
          size: result.size,
          uploadedAt: new Date(),
        };
      });

      uploadedImages = await Promise.all(uploadPromises);
      console.log(`Successfully uploaded ${uploadedImages.length} images`);
    }

    // Create installation record with images
    const installation = await Installation.create({
      customer,
      phone,
      location,
      reference,
      installedAt,
      speed,
      notes,
      rsrp,
      createdBy: userId,
      images: uploadedImages,
    });

    return res.status(201).json({
      message: "Installation created successfully",
      installation,
    });
  } catch (error: any) {
    console.error("Error creating installation:", error);

    // Clean up uploaded images if installation creation fails
    if (uploadedImages.length > 0) {
      console.log("Cleaning up uploaded images due to error...");
      try {
        const imageKeys = uploadedImages.map((img) => img.key);
        await ImageService.deleteMultipleFromS3(imageKeys);
      } catch (cleanupError) {
        console.error("Error cleaning up images:", cleanupError);
      }
    }

    // Handle unique constraint error for reference
    if (error.code === 11000 && error.keyPattern?.reference) {
      return res.status(409).json({
        message: "Reference number already exists. Please use a unique reference.",
      });
    }

    throw error; // Let asyncHandler handle the error
  }
};

export const getInstallations = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized: User not authenticated",
    });
  }

  // Find all installations created by this user
  const installations = await Installation.find({ createdBy: userId })
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    installations,
    count: installations.length,
  });
};

export const getInstallationById = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized: User not authenticated",
    });
  }

  if (!id) {
    return res.status(400).json({
      message: "Installation ID is required",
    });
  }

  const installation = await Installation.findOne({
    _id: id,
    createdBy: userId,
  }).populate("createdBy", "name email");

  if (!installation) {
    throw new NotFoundError("Installation not found");
  }

  return res.status(200).json({
    installation,
  });
};

export const updateInstallation = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized: User not authenticated",
    });
  }

  if (!id) {
    return res.status(400).json({
      message: "Installation ID is required",
    });
  }

  const {
    customer,
    location,
    reference,
    installedAt,
    phone,
    speed,
    notes,
    rsrp,
  } = req.body;

  // Note: Images are not updated, only installation details
  const installation = await Installation.findOneAndUpdate(
    {
      _id: id,
      createdBy: userId,
    },
    {
      customer,
      phone,
      location,
      reference,
      installedAt,
      speed,
      notes,
      rsrp,
    },
    { new: true, runValidators: true }
  );

  if (!installation) {
    throw new NotFoundError("Installation not found");
  }

  return res.status(200).json({
    message: "Installation updated successfully",
    installation,
  });
};

export const deleteInstallation = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized: User not authenticated",
    });
  }

  if (!id) {
    return res.status(400).json({
      message: "Installation ID is required",
    });
  }

  const installation = await Installation.findOne({
    _id: id,
    createdBy: userId,
  });

  if (!installation) {
    throw new NotFoundError("Installation not found");
  }

  // Delete all images from S3 before deleting the installation
  if (installation.images && installation.images.length > 0) {
    console.log(`Deleting ${installation.images.length} images from S3...`);
    try {
      const imageKeys = installation.images.map((img) => img.key);
      await ImageService.deleteMultipleFromS3(imageKeys);
      console.log("Images deleted successfully from S3");
    } catch (error) {
      console.error("Error deleting images from S3:", error);
      // Continue with installation deletion even if image deletion fails
    }
  }

  await Installation.findByIdAndDelete(id);

  return res.status(200).json({
    message: "Installation deleted successfully",
  });
};
