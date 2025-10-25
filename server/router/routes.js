import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { googleAuth, logout } from "../controllers/authController.js";
import { getUserInfo } from "../controllers/userInfoController.js";

const router = Router();

// AuthRoutes
router.post("/auth/google/callback", googleAuth);
router.post("/auth/logout", logout);
router.get("/userInfo", authMiddleware ,getUserInfo)

export default router;