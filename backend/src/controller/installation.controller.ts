// src/controller/installation.controller.ts

import {
  Installation,
  type IInstallationImage,
} from "../model/installation.model.ts";
import { type Request, type Response } from "express";
import { NotFoundError, ConflictError } from "../utils/customErrors.ts";
import { ImageService } from "../service/image.service.ts";

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
  if (
    !reference ||
    typeof reference !== "string" ||
    reference.trim().length === 0
  ) {
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
  let uploadedImages: IInstallationImage[] = [];

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
        message:
          "Reference number already exists. Please use a unique reference.",
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

export const getInstallationStats = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  const userId = req.user?.id;
  const { date, type } = req.query;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized: User not authenticated",
    });
  }

  const targetDate = date ? new Date(date as string) : new Date();
  let startDate: Date;
  let endDate: Date;

  switch (type) {
    case "daily":
      startDate = new Date(targetDate);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(targetDate);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "weekly":
      // Week starts on Monday
      const dayOfWeek = targetDate.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      startDate = new Date(targetDate);
      startDate.setDate(targetDate.getDate() + mondayOffset);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 5); // Monday to Saturday
      endDate.setHours(23, 59, 59, 999);
      break;

    case "monthly":
      startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
      endDate = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth() + 1,
        0
      );
      endDate.setHours(23, 59, 59, 999);
      break;

    default:
      return res.status(400).json({
        message: "Invalid type. Must be 'daily', 'weekly', or 'monthly'",
      });
  }

  const installations = await Installation.find({
    createdBy: userId,
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ createdAt: -1 });

  return res.status(200).json({
    installations,
    count: installations.length,
    period: {
      start: startDate,
      end: endDate,
      type,
    },
  });
};

export const getDashboardStats = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized: User not authenticated",
    });
  }

  try {
    const now = new Date();

    // Get all time installations
    const allTimeInstallations = await Installation.find({ createdBy: userId });

    // Today's installations
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const todayInstallations = await Installation.find({
      createdBy: userId,
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    // This week's installations (Monday to Sunday)
    const weekStart = new Date(now);
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    weekStart.setDate(now.getDate() + mondayOffset);
    weekStart.setHours(0, 0, 0, 0);

    const weekInstallations = await Installation.find({
      createdBy: userId,
      createdAt: { $gte: weekStart },
    });

    // This month's installations
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthInstallations = await Installation.find({
      createdBy: userId,
      createdAt: { $gte: monthStart },
    });

    // Last 5 days data for chart
    const last5Days = [];
    for (let i = 4; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      const dayInstallations = await Installation.find({
        createdBy: userId,
        createdAt: { $gte: date, $lt: nextDay },
      });

      last5Days.push({
        date: date.toISOString().split("T")[0],
        count: dayInstallations.length,
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
      });
    }

    // Last 5 weeks data
    const last5Weeks = [];
    for (let i = 4; i >= 0; i--) {
      const weekDate = new Date(now);
      weekDate.setDate(now.getDate() - i * 7);
      const weekStartDate = new Date(weekDate);
      const dayOfWeek = weekDate.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      weekStartDate.setDate(weekDate.getDate() + mondayOffset);
      weekStartDate.setHours(0, 0, 0, 0);

      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekStartDate.getDate() + 6);
      weekEndDate.setHours(23, 59, 59, 999);

      const weekInstallationsCount = await Installation.find({
        createdBy: userId,
        createdAt: { $gte: weekStartDate, $lte: weekEndDate },
      });

      last5Weeks.push({
        week: `Week ${weekStartDate.getDate()}/${weekStartDate.getMonth() + 1}`,
        count: weekInstallationsCount.length,
        startDate: weekStartDate.toISOString().split("T")[0],
      });
    }

    // Last 5 months data
    const last5Months = [];
    for (let i = 4; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEndDate = new Date(
        now.getFullYear(),
        now.getMonth() - i + 1,
        0
      );
      monthEndDate.setHours(23, 59, 59, 999);

      const monthInstallationsCount = await Installation.find({
        createdBy: userId,
        createdAt: { $gte: monthDate, $lte: monthEndDate },
      });

      last5Months.push({
        month: monthDate.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        count: monthInstallationsCount.length,
        date: monthDate.toISOString().split("T")[0],
      });
    }

    // Calculate averages
    const avgRsrp =
      allTimeInstallations.length > 0
        ? allTimeInstallations.reduce(
            (sum, inst) => sum + (inst.rsrp || 0),
            0
          ) / allTimeInstallations.length
        : 0;

    const avgSpeed =
      allTimeInstallations.length > 0
        ? allTimeInstallations.reduce(
            (sum, inst) => sum + (inst.speed || 0),
            0
          ) / allTimeInstallations.length
        : 0;

    return res.status(200).json({
      stats: {
        allTime: allTimeInstallations.length,
        today: todayInstallations.length,
        thisWeek: weekInstallations.length,
        thisMonth: monthInstallations.length,
        averages: {
          rsrp: Math.round(avgRsrp * 100) / 100,
          speed: Math.round(avgSpeed * 100) / 100,
        },
      },
      chartData: {
        daily: last5Days,
        weekly: last5Weeks,
        monthly: last5Months,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
