import Student from "../models/Student.js";
import path from "path";

// CREATE / UPDATE PROFILE
export const updateStudentProfile = async (req, res) => {
  try {
    const { phone, branch, cgpa, skills, college, passoutYear, degree, about, linkedin, github } = req.body;

    const skillsArray = typeof skills === "string"
      ? skills.split(",").map(s => s.trim()).filter(Boolean)
      : skills || [];

    // Check if resume file was uploaded
    let resumePath = undefined;
    let resumeOriginalName = undefined;
    if (req.file) {
      resumePath = "/uploads/" + req.file.filename;
      resumeOriginalName = req.file.originalname;
    }

    let student = await Student.findOne({ user: req.user._id });

    const updateData = {
      phone, branch, cgpa: parseFloat(cgpa) || undefined,
      skills: skillsArray, college,
      passoutYear: parseInt(passoutYear) || undefined,
      degree, about, linkedin, github,
    };

    if (resumePath) {
      updateData.resume = resumePath;
      updateData.resumeOriginalName = resumeOriginalName;
    }

    // Check profile complete
    const requiredFields = [phone, branch, cgpa, college, passoutYear, degree];
    updateData.profileComplete = requiredFields.every(f => f && String(f).trim() !== "");

    if (student) {
      Object.assign(student, updateData);
      await student.save();
    } else {
      student = await Student.create({ user: req.user._id, ...updateData });
    }

    res.status(200).json({ success: true, message: "Profile updated successfully", student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET PROFILE
export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate("user", "name email role");
    res.status(200).json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL STUDENTS (Admin only)
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("user", "name email role").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: students.length, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
