import express from "express";
import { registerUser, loginUser, getMe, updateProfile, uploadResume, aiResumeAnalyzer } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "/tmp"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfile);
router.post("/upload-resume", protect, upload.single("resume"), uploadResume);
router.post("/ai-resume-analyzer", protect, aiResumeAnalyzer);

export default router;