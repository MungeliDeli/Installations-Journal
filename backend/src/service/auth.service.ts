import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { type IUser } from "../model/user.model.js";

export const hashpassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hashpassword: string
) => {
  return await bcrypt.compare(password, hashpassword);
};

export const generatToken = (user: IUser) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );
};
