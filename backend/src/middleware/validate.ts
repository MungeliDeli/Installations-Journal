import { type Request, type Response, type NextFunction } from "express";
import { type Schema } from "joi";
import { ValidationError } from "../utils/customErrors.js";

export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 1 get the errors and value from the validated req.body
    // 2 throw new vlaidaiton error 
    //   3 else replace req.body with sanitized values
    // 4 next()

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      throw new ValidationError("Validation falied", errorMessage);
    }

    req.body = value;

    next();
  };
};
