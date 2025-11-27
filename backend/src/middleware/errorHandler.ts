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

  if (err.name === "ValidationError") {
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

  console.error("Error: ", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
  });

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
