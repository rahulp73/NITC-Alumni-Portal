import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  applicationLink: { type: String },
  type: { type: String, enum: ["Full-time", "Internship", "Contract"], required: true },
  tags: [String],
  postedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  postedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "published", "closed"], default: "pending" },
  skillsRequired: [String],
  applicationDeadline: { type: Date },
  internalApply: { type: Boolean, default: false },
}, { timestamps: true });

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  applicantUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resumeUrl: { type: String },
  coverLetter: { type: String },
  status: { type: String, enum: ["applied", "shortlisted", "rejected", "hired"], default: "applied" },
  appliedAt: { type: Date, default: Date.now },
  notes: { type: String },
}, { timestamps: true });

export const Job = mongoose.model("Job", jobSchema);
export const Application = mongoose.model("Application", applicationSchema);
