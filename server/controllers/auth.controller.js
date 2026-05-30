import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import {analyzeResume,} from "../services/ai.service.js";


// REGISTER
export const registerUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role,
    } = req.body;

    // Check user exists
    const userExists =
      await User.findOne({ email });

    if (userExists) {

      return res.status(400).json({
        success: false,
        message: "User already exists",
      });

    }

    // Hash password
    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    // Create user
    const user =
      await User.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

    // Generate token
    const token =
      generateToken(
        user._id,
        user.role
      );

    res.status(201).json({
      success: true,

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};




// LOGIN
export const loginUser = async (
  req,
  res
) => {

  try {

    const {
      email,
      password,
    } = req.body;

    // Find user
    const user =
      await User.findOne({ email });

    if (!user) {

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });

    }

    // Compare password
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });

    }

    // Generate token
    const token =
      generateToken(
        user._id,
        user.role
      );

    res.status(200).json({
      success: true,

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};




// GET LOGGED IN USER
export const getMe = async (
  req,
  res
) => {

  res.status(200).json({
    success: true,
    user: req.user,
  });

};




// LOGOUT
export const logoutUser = async (
  req,
  res
) => {

  try {

    res.status(200).json({
      success: true,
      message:
        "Logged out successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};




// UPDATE PROFILE
export const updateProfile =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );

      if (!user) {

        return res.status(404).json({
          success: false,
          message: "User not found",
        });

      }

      user.phone =
        req.body.phone || user.phone;

      user.branch =
        req.body.branch || user.branch;

      user.cgpa =
        req.body.cgpa || user.cgpa;

      user.skills =
        req.body.skills || user.skills;

      user.college =
        req.body.college || user.college;

      user.passoutYear =
        req.body.passoutYear ||
        user.passoutYear;

      await user.save();

      res.status(200).json({
        success: true,
        message:
          "Profile updated successfully",
        user,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };

  // UPLOAD RESUME

export const uploadResume =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );

      if (!user) {

        return res.status(404).json({
          success: false,
          message: "User not found",
        });

      }

      // Save file path
      user.resume =
        req.file.path;

      await user.save();

      res.status(200).json({
        success: true,
        message:
          "Resume uploaded successfully",

        resume:
          user.resume,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };

  // AI RESUME ANALYZER

export const aiResumeAnalyzer =
  async (req, res) => {

    try {

      const {
        resumeText,
      } = req.body;

      if (!resumeText) {

        return res.status(400).json({
          success: false,
          message:
            "Resume text is required",
        });

      }

      // AI Analysis
      const analysis =
        await analyzeResume(
          resumeText
        );

      res.status(200).json({
        success: true,
        analysis,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };