import { Router } from "express";
import { register, login } from "../controller/user.controller.ts";
import { authenticate } from "../middleware/auth.ts";
import { validate } from "../middleware/validate.ts";
import { userSchema, loginSchema } from "../validation/user.validate.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
const router = Router();

router.post("/register", validate(userSchema), asyncHandler(register));
router.post("/login", validate(loginSchema), asyncHandler(login));

export default router;
