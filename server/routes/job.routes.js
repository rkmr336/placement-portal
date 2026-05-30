import express from "express";

import {
  createJob,
  getAllJobs,
  getSingleJob,
  deleteJob,
  getJobApplications,
} from "../controllers/job.controller.js";

import {
  protect,
} from "../middleware/auth.middleware.js";

import {
  authorizeRoles,
} from "../middleware/role.middleware.js";

const router = express.Router();


// Company creates job
router.post(
  "/create",
  protect,
  authorizeRoles("company"),
  createJob
);


// Student/Admin/All can view jobs
router.get(
  "/all",
  getAllJobs
);


// Single Job
router.get(
  "/:id",
  getSingleJob
);


// Delete job (Company only)
router.delete(
  "/:id",
  protect,
  authorizeRoles("company"),
  deleteJob
);


// Get applications for a job (Company only)
router.get(
  "/:id/applications",
  protect,
  authorizeRoles("company"),
  getJobApplications
);

export default router;