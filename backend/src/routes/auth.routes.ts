import { Router } from "express";
import { register , login } from "../controller/user.controller.js";
// import { authenticate } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/register", register);
router.post("/login", login)

// we will have protect routs that need to login in to access. example, profile 
// router.get("/profile" ,authenticate , getProfile )

export default router;
