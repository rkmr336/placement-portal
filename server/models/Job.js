import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
    },

    salary: {
      type: Number,
    },

    skillsRequired: [
      {
        type: String,
      },
    ],

    eligibility: {
      branch: {
        type: String,
      },

      minCGPA: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model(
  "Job",
  jobSchema
);

export default Job;