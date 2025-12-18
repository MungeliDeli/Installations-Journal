import { type Request, type Response, type NextFunction } from "express";
import { AppError } from "../utils/customErrors.js";
import { url } from "inspector";

// main error handler middleware  function
export const erroHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // defaul error values
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: any[] | undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }

  // Handle Multer errors
  if (err.name === "MulterError") {
    statusCode = 400;
    const multerErr = err as any;
    if (multerErr.code === "LIMIT_FILE_SIZE") {
      message = "File too large. Maximum size is 10MB per file.";
    } else if (multerErr.code === "LIMIT_FILE_COUNT") {
      message = "Too many files. Maximum 10 files allowed.";
    } else if (multerErr.code === "LIMIT_UNEXPECTED_FILE") {
      message = "Unexpected file field.";
    } else {
      message = "File upload error: " + multerErr.message;
    }
  } else if (err.message && err.message.includes("Invalid file type")) {
    statusCode = 400;
    message = err.message;
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    errors = Object.values((err as any).errors).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID formar";
  } else if ((err as any).code === 11000) {
    statusCode = 409;
    message = "Duplicate field value";
    const field = Object.keys((err as any).keyPattern)[0];
    errors = [{ field, message: `${field} already exists` }];
  }
  // Handle JWT errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  console.error("=== ERROR HANDLER ===");
  console.error("Error type:", err?.constructor?.name);
  console.error("Error message:", err.message);
  console.error("Error stack:", err.stack);
  console.error("Request details:", {
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    files: req.files,
  });
  console.error("Processed errors:", errors);

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};
// this is the 404 not found handler for the routes

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};
