import { Job, Application } from '../schemas/jobs.js';

// Create a new job
export const createJob = async (req, res) => {
  try {
    const { title, company, location, description, applicationLink, type, tags, skillsRequired, applicationDeadline, internalApply } = req.body;
    const job = await Job.create({
      title,
      company,
      location,
      description,
      applicationLink,
      type,
      tags,
      skillsRequired,
      applicationDeadline,
      internalApply,
      postedByUserId: req._id,
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: 'Error creating job', error: err.message });
  }
};

// List all jobs
export const listJobs = async (req, res) => {
  try {
    const now = new Date();
    // Only return jobs whose applicationDeadline is in the future (or not set)
    const jobs = await Job.find({
      $or: [
        { applicationDeadline: { $exists: false } },
        { applicationDeadline: { $gte: now } }
      ]
    }).sort({ postedAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching jobs', error: err.message });
  }
};

// Apply for a job
export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const alreadyApplied = await Application.findOne({ jobId, applicantUserId: req._id });
    if (alreadyApplied) return res.status(400).json({ message: 'Already applied' });
    const application = await Application.create({ jobId, applicantUserId: req._id });
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: 'Error applying for job', error: err.message });
  }
};
