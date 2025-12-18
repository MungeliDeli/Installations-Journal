import { Router } from "express";
import { register, login } from "../controller/user.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { userSchema, loginSchema } from "../validation/user.validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const router = Router();

router.post("/register", validate(userSchema), asyncHandler(register));
router.post("/login", validate(loginSchema), asyncHandler(login));

export default router;
