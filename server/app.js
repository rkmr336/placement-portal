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

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map(o => o.trim()) : [])
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.startsWith("http://localhost:")) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

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