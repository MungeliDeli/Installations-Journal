import jwt from "jsonwebtoken";
import { type Request, type Response, type NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. check for the the token in the header
    // 2. decode
    // 3. next (pass to next middleware)

    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
      return res.status(401).json({
        message: "Acees denied. No token provided",
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid toke",
      error,
    });
  }
};
