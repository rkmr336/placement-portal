import Company from "../models/Company.js";

// CREATE / UPDATE COMPANY PROFILE
export const updateCompanyProfile = async (req, res) => {
  try {
    const { description, website, location, industry, size, phone, founded } = req.body;

    let logoPath = undefined;
    if (req.file) {
      logoPath = "/uploads/" + req.file.filename;
    }

    let company = await Company.findOne({ user: req.user._id });

    const updateData = { description, website, location, industry, size, phone, founded: parseInt(founded) || undefined };
    if (logoPath) updateData.logo = logoPath;

    const requiredFields = [description, location, industry];
    updateData.profileComplete = requiredFields.every(f => f && String(f).trim() !== "");

    if (company) {
      Object.assign(company, updateData);
      await company.save();
    } else {
      company = await Company.create({ user: req.user._id, ...updateData });
    }

    res.status(200).json({ success: true, message: "Company profile updated", company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET COMPANY PROFILE
export const getCompanyProfile = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user._id }).populate("user", "name email");
    res.status(200).json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
