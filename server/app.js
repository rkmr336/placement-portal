import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import companyRoutes from "./routes/company.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Serve uploaded files (resumes, logos)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/company", companyRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Placement Portal API Running ✅" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

export default app;
