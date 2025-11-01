import { Router } from "express";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";

const alumniRouter = Router();

// Example: All authenticated users can search alumni
alumniRouter.get("/search", authMiddleware, requireRole(["student", "alumni", "admin"]), (req, res) => {
  // Alumni search logic here
  res.json({ message: "Alumni search results" });
});

export default alumniRouter;
