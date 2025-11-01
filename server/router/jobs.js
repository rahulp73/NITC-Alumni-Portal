import { Router } from "express";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";
import { createJob, listJobs, applyForJob } from "../controllers/jobsController.js";

const jobsRouter = Router();


// Create job
jobsRouter.post("/", authMiddleware, requireRole(["alumni", "admin"]), createJob);

// List all jobs
jobsRouter.get("/", authMiddleware, requireRole(["student", "alumni", "admin"]), listJobs);

// Apply for job
jobsRouter.post("/:jobId/apply", authMiddleware, requireRole(["student", "alumni", "admin"]), applyForJob);

export default jobsRouter;
