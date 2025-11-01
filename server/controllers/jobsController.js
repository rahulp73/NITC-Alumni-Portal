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
      status: 'pending',
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
    let query = {
      $or: [
        { applicationDeadline: { $exists: false } },
        { applicationDeadline: { $gte: now } }
      ]
    };
    // Admin sees all jobs, others see only published or their own pending
    if (req.user?.role === 'admin') {
      // Show all jobs
    } else {
      query = {
        ...query,
        $or: [
          { status: 'published' },
          { status: 'pending', postedByUserId: req._id },
        ],
      };
    }
    const jobs = await Job.find(query).sort({ postedAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching jobs', error: err.message });
  }
};

// Admin: verify job (set status to 'published')
export const verifyJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findByIdAndUpdate(jobId, { status: 'published' }, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Error verifying job', error: err.message });
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
