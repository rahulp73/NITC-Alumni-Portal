import { Router } from "express";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";

import { createEvent, listEvents, registerForEvent, unregisterForEvent, getRegisteredEvents, verifyEvent } from "../controllers/eventsController.js";
const eventsRouter = Router();
// Admin: verify event
eventsRouter.patch("/:eventId/verify", authMiddleware, requireRole(["admin"]), verifyEvent);
// Get all event IDs the current user is registered for
eventsRouter.get("/registered", authMiddleware, requireRole(["student", "alumni", "admin"]), getRegisteredEvents);

// Unregister from event
eventsRouter.delete("/:eventId/register", authMiddleware, requireRole(["student", "alumni", "admin"]), unregisterForEvent);


// Create event
eventsRouter.post("/", authMiddleware, requireRole(["student", "alumni", "admin"]), createEvent);

// List all events
eventsRouter.get("/", authMiddleware, requireRole(["student", "alumni", "admin"]), listEvents);

// Register for event
eventsRouter.post("/:eventId/register", authMiddleware, requireRole(["student", "alumni", "admin"]), registerForEvent);

export default eventsRouter;
