
// custom error class tha extends the built in error class
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errors?: any[] | undefined;

  constructor(messege: string, statusCode: number = 500, errors?: any[]) {
    super(messege);
    this.statusCode = statusCode;
    this.isOperational = true; //distinguishes between operational and programming error
    this.errors = errors;
  }
}

// specific error classes for common scenarios

export class ValidationError extends AppError {
  constructor(message: string = "validation failed", errors?: any[]) {
    super(message, 400, errors);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized access") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Access forbidden") {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource already exists") {
    super(message, 409);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad request") {
    super(message, 400);
  }
}
