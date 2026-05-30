import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    phone: { type: String },
    branch: { type: String },
    cgpa: { type: Number },
    skills: [{ type: String }],
    college: { type: String, default: "" },
    passoutYear: { type: Number },
    degree: { type: String },
    resume: { type: String }, // file path after upload
    resumeOriginalName: { type: String },
    profilePhoto: { type: String },
    about: { type: String },
    linkedin: { type: String },
    github: { type: String },
    profileComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);
export default Student;
