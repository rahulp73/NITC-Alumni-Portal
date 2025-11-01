import { verifyJob } from "../controllers/jobsController.js";
import { Router } from "express";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";
import { createJob, listJobs, applyForJob } from "../controllers/jobsController.js";

const jobsRouter = Router();

// Admin: verify job
jobsRouter.patch("/:jobId/verify", authMiddleware, requireRole(["admin"]), verifyJob);

// Create job
jobsRouter.post("/", authMiddleware, requireRole(["alumni", "admin"]), createJob);

// List all jobs
jobsRouter.get("/", authMiddleware, requireRole(["student", "alumni", "admin"]), listJobs);

// Apply for job
jobsRouter.post("/:jobId/apply", authMiddleware, requireRole(["student", "alumni", "admin"]), applyForJob);

export default jobsRouter;
