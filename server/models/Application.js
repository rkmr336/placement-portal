import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Rejected", "Selected"],
      default: "Applied",
    },
    coverLetter: {
      type: String,
      default: "",
    },
    resumeAtApply: {
      type: String, // resume path at time of applying
      default: "",
    },
  },
  { timestamps: true }
);

const Application = mongoose.models.Application || mongoose.model("Application", applicationSchema);
export default Application;
