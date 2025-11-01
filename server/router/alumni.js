
import { Router } from "express";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";
import { searchAlumni } from "../controllers/alumniController.js";

const alumniRouter = Router();

// Example: All authenticated users can search alumni
alumniRouter.get("/search", authMiddleware, requireRole(["student", "alumni", "admin"]), searchAlumni);

export default alumniRouter;
