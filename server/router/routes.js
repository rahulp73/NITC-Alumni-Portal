import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { googleAuth, logout, signup, signin } from "../controllers/authController.js";
import { getUserInfo, updateUserInfo, getUserById, uploadAvatar } from "../controllers/userInfoController.js";

const router = Router();

// AuthRoutes
router.post("/auth/google/callback", googleAuth);
router.post("/auth/logout", logout);
router.post("/auth/signup", signup);
router.post("/auth/signin", signin);
router.get("/userInfo", authMiddleware ,getUserInfo);
router.put("/userInfo", authMiddleware, updateUserInfo);
router.get("/user/:userId", authMiddleware, getUserById);
router.put("/user/avatar", authMiddleware, uploadAvatar);

export default router;