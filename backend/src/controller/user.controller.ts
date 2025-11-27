import { type Request, type Response } from "express";
import { User } from "../model/user.model.js";
import {
  hashpassword,
  comparePassword,
  generatToken,
} from "../Service/auth.service.js";
import { ConflictError, UnauthorizedError } from "../utils/customErrors.js";

export const register = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  // 1. extract user from req.body
  // 2.check if user already exist
  // 3. hash password
  // 3.create user

  const { name, email, password, phone } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists)
    throw new ConflictError("User with this email already exist ");

  const hash = await hashpassword(password);

  const user = await User.create({ name, email, password: hash, phone });

  return res.status(200).json({
    message: "User registered successfully",
    User: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });
};

export const login = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({
      message: "Invalid Credentials",
    });

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new UnauthorizedError("Invalid Credentials");

  const token = generatToken(user);

  return res.status(200).json({
    message: "Loging successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });
};
