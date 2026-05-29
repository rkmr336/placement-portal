import mongoose from "mongoose";

const userSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
      },

      password: {
        type: String,
        required: true,
      },

      role: {
        type: String,

        enum: [
          "student",
          "company",
          "admin",
        ],

        default: "student",
      },

      // STUDENT DETAILS
      phone: {
        type: String,
      },

      branch: {
        type: String,
      },

      cgpa: {
        type: Number,
      },

      skills: [
        {
          type: String,
        },
      ],

      college: {
        type: String,
      },

      passoutYear: {
        type: Number,
      },

      resume: {
        type: String,
      },

      profilePhoto: {
        type: String,
      },
    },

    {
      timestamps: true,
    }
  );
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;