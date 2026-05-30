import express from "express";
import { applyJob, getMyApplications, getJobApplicants, updateApplicationStatus, withdrawApplication } from "../controllers/application.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Student apply job (with cover letter)
router.post("/apply/:jobId", protect, authorizeRoles("student"), applyJob);

// Student view applications
router.get("/my-applications", protect, authorizeRoles("student"), getMyApplications);

// Student withdraw application
router.delete("/:id", protect, authorizeRoles("student"), withdrawApplication);

// Company view applicants
router.get("/job/:jobId", protect, authorizeRoles("company"), getJobApplicants);

// Company update status
router.put("/status/:id", protect, authorizeRoles("company"), updateApplicationStatus);

export default router;
