import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Student from "../models/Student.js";

// APPLY JOB (with cover letter + eligibility check)
export const applyJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const { coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    // Already applied check
    const alreadyApplied = await Application.findOne({ student: req.user._id, job: jobId });
    if (alreadyApplied) return res.status(400).json({ success: false, message: "Already applied for this job" });

    // Eligibility check
    const student = await Student.findOne({ user: req.user._id });

    if (job.eligibility?.minCGPA && student?.cgpa) {
      if (student.cgpa < job.eligibility.minCGPA) {
        return res.status(403).json({
          success: false,
          message: `Minimum CGPA required is ${job.eligibility.minCGPA}. Your CGPA: ${student.cgpa}`,
        });
      }
    }

    if (job.eligibility?.branch && student?.branch) {
      const eligibleBranches = job.eligibility.branch.toLowerCase().split(",").map(b => b.trim());
      const studentBranch = student.branch.toLowerCase().trim();
      const branchMatch = eligibleBranches.some(b => studentBranch.includes(b) || b.includes(studentBranch));
      if (!branchMatch) {
        return res.status(403).json({
          success: false,
          message: `Your branch (${student.branch}) is not eligible for this job`,
        });
      }
    }

    const application = await Application.create({
      student: req.user._id,
      job: jobId,
      coverLetter: coverLetter || "",
      resumeAtApply: student?.resume || "",
    });

    res.status(201).json({ success: true, message: "Applied successfully!", application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// MY APPLICATIONS
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate("job")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET APPLICANTS FOR COMPANY JOB
export const getJobApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const applications = await Application.find({ job: jobId })
      .populate("student", "name email role")
      .populate("job", "title");
    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE APPLICATION STATUS
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate("job");
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });

    if (application.job.company.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });

    const validStatuses = ["Applied", "Shortlisted", "Rejected", "Selected"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    application.status = status;
    await application.save();
    res.status(200).json({ success: true, message: "Status updated", application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// WITHDRAW APPLICATION
export const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });

    if (application.student.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });

    await Application.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Application withdrawn" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
