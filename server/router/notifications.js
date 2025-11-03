import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
} from "../controllers/notificationsController.js";

const router = Router();

router.get("/", authMiddleware, getUserNotifications);
router.get("/unread-count", authMiddleware, getUnreadCount);
router.put("/:notificationId/read", authMiddleware, markNotificationAsRead);
router.put("/mark-all-read", authMiddleware, markAllNotificationsAsRead);

export default router;

