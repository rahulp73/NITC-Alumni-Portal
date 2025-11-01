import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organizerUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  organizerName: { type: String },
  date: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String },
  tags: [String],
  capacity: { type: Number },
  status: { type: String, enum: ["upcoming", "cancelled", "postponed", "completed"], default: "upcoming" },
  publishedAt: { type: Date, default: Date.now },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

const eventRegistrationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  registeredAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["registered", "cancelled"], default: "registered" },
}, { timestamps: true });

export const Event = mongoose.model("Event", eventSchema);
export const EventRegistration = mongoose.model("EventRegistration", eventRegistrationSchema);
