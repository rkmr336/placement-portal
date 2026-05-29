import Job from "../models/Job.js";
import Application from "../models/Application.js";


// CREATE JOB
export const createJob =
  async (req, res) => {

    try {

      const {
        title,
        description,
        location,
        salary,
        skillsRequired,
        eligibility,
      } = req.body;

      const job = await Job.create({
        title,
        description,
        location,
        salary,
        skillsRequired,
        eligibility,

        company: req.user._id,
      });

      res.status(201).json({
        success: true,
        message: "Job created successfully",
        job,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };



// GET ALL JOBS
export const getAllJobs =
  async (req, res) => {

    try {

      const jobs = await Job.find()
        .populate(
          "company",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        jobs,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };



// GET SINGLE JOB
export const getSingleJob =
  async (req, res) => {

    try {

      const job = await Job.findById(
        req.params.id
      ).populate(
        "company",
        "name email"
      );

      if (!job) {

        return res.status(404).json({
          success: false,
          message: "Job not found",
        });

      }

      res.status(200).json({
        success: true,
        job,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };



// DELETE JOB (Company only)
export const deleteJob =
  async (req, res) => {

    try {

      const job = await Job.findById(
        req.params.id
      );

      if (!job) {

        return res.status(404).json({
          success: false,
          message: "Job not found",
        });

      }

      // Check if user is the company
      if (job.company.toString() !== req.user._id.toString()) {

        return res.status(403).json({
          success: false,
          message: "Not authorized to delete this job",
        });

      }

      // Delete all applications for this job
      await Application.deleteMany({
        job: req.params.id,
      });

      await Job.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message: "Job deleted successfully",
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };



// GET JOB APPLICATIONS (Company only)
export const getJobApplications =
  async (req, res) => {

    try {

      const job = await Job.findById(
        req.params.id
      );

      if (!job) {

        return res.status(404).json({
          success: false,
          message: "Job not found",
        });

      }

      // Check if user is the company
      if (job.company.toString() !== req.user._id.toString()) {

        return res.status(403).json({
          success: false,
          message: "Not authorized to view applications",
        });

      }

      const applications =
        await Application.find({
          job: req.params.id,
        })
          .populate(
            "student",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        count: applications.length,
        applications,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };