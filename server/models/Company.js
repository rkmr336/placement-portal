import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: { type: String, default: "" },
    website: { type: String, default: "" },
    location: { type: String, default: "" },
    industry: { type: String, default: "" },
    size: { type: String, default: "" }, // e.g. "1-50", "50-200"
    logo: { type: String, default: "" },
    phone: { type: String, default: "" },
    founded: { type: Number },
    profileComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Company = mongoose.models.Company || mongoose.model("Company", companySchema);
export default Company;
