import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { updateCompanyProfile, getCompanyProfile } from "../controllers/company.controller.js";
import { uploadLogo } from "../middleware/upload.middleware.js";

const router = express.Router();

// Update company profile (with logo upload)
router.post("/profile", protect, authorizeRoles("company"), uploadLogo, updateCompanyProfile);

// Get company profile
router.get("/profile", protect, authorizeRoles("company"), getCompanyProfile);

export default router;
