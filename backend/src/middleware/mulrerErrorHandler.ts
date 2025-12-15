// src/middleware/multerErrorHandler.ts

import { type Request, type Response, type NextFunction } from "express";
import multer from "multer";

/**
 * Middleware to handle Multer-specific errors
 * Place this AFTER your routes but BEFORE your general error handler
 */
export const multerErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Handle Multer-specific errors
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({
          message: "File size too large. Maximum 10MB per file allowed",
        });

      case "LIMIT_FILE_COUNT":
        return res.status(400).json({
          message: "Too many files. Maximum 10 images allowed",
        });

      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({
          message:
            "Unexpected field in form data. Use 'images' as the field name",
        });

      case "LIMIT_PART_COUNT":
        return res.status(400).json({
          message: "Too many parts in the multipart form",
        });

      case "LIMIT_FIELD_KEY":
        return res.status(400).json({
          message: "Field name too long",
        });

      case "LIMIT_FIELD_VALUE":
        return res.status(400).json({
          message: "Field value too long",
        });

      case "LIMIT_FIELD_COUNT":
        return res.status(400).json({
          message: "Too many fields",
        });

      default:
        return res.status(400).json({
          message: `Upload error: ${err.message}`,
        });
    }
  }

  // Handle custom file filter errors (from our multer config)
  if (
    err instanceof Error &&
    err.message.includes("Only image files are allowed")
  ) {
    return res.status(400).json({
      message:
        "Only image files are allowed. Please upload PNG, JPG, JPEG, GIF, or WebP files",
    });
  }

  // If it's not a multer error, pass it to the next error handler
  next(err);
};
