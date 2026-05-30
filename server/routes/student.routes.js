import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { updateStudentProfile, getStudentProfile, getAllStudents } from "../controllers/student.controller.js";
import { uploadResume } from "../middleware/upload.middleware.js";

const router = express.Router();

// Dashboard
router.get("/dashboard", protect, authorizeRoles("student"), (req, res) => {
  res.status(200).json({ success: true, message: "Welcome Student Dashboard", user: req.user });
});

// Update Profile (with resume upload)
router.post("/profile", protect, authorizeRoles("student"), uploadResume, updateStudentProfile);

// Get Profile
router.get("/profile", protect, authorizeRoles("student"), getStudentProfile);

// Get All Students (Admin only)
router.get("/all-students", protect, authorizeRoles("admin"), getAllStudents);

export default router;
