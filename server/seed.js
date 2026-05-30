import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "./models/Job.js";
import User from "./models/user.js";
import bcrypt from "bcryptjs";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB Connected");

// Create demo companies
const companies = [
  { name: "Google India", email: "hr@google.com" },
  { name: "Microsoft", email: "hr@microsoft.com" },
  { name: "Amazon", email: "hr@amazon.com" },
  { name: "Infosys", email: "hr@infosys.com" },
  { name: "TCS", email: "hr@tcs.com" },
  { name: "Wipro", email: "hr@wipro.com" },
  { name: "Zomato", email: "hr@zomato.com" },
  { name: "Flipkart", email: "hr@flipkart.com" },
];

const password = await bcrypt.hash("123456", 10);

const companyUsers = [];
for (const c of companies) {
  let user = await User.findOne({ email: c.email });
  if (!user) {
    user = await User.create({ name: c.name, email: c.email, password, role: "company" });
    console.log("Created company:", c.name);
  }
  companyUsers.push(user);
}

// Create demo jobs
const jobs = [
  {
    title: "Software Development Engineer",
    description: "Work on cutting-edge products used by millions. You will design, build and maintain scalable software systems. Collaborate with cross-functional teams to deliver high-quality solutions.",
    location: "Bangalore",
    salary: 1800000,
    skillsRequired: ["Java", "Python", "System Design", "DSA"],
    eligibility: { minCGPA: 7.5, branch: "CSE, IT, ECE" },
    company: companyUsers[0]._id,
  },
  {
    title: "Software Engineer II",
    description: "Join our engineering team to build enterprise-scale cloud solutions. Work with Azure, .NET and modern web technologies to create impactful products for global customers.",
    location: "Hyderabad",
    salary: 2000000,
    skillsRequired: ["C#", ".NET", "Azure", "React", "SQL"],
    eligibility: { minCGPA: 7.0, branch: "CSE, IT" },
    company: companyUsers[1]._id,
  },
  {
    title: "SDE-1",
    description: "Build and own large-scale distributed systems. Solve complex engineering problems that impact millions of customers worldwide. Work in a fast-paced, innovative environment.",
    location: "Hyderabad / Remote",
    salary: 2200000,
    skillsRequired: ["Java", "AWS", "Distributed Systems", "DSA"],
    eligibility: { minCGPA: 7.0, branch: "CSE, IT, ECE" },
    company: companyUsers[2]._id,
  },
  {
    title: "Systems Engineer",
    description: "Start your career with India's leading IT company. Work on global projects across various domains including banking, retail, and healthcare. Training provided.",
    location: "Pune / Chennai / Bangalore",
    salary: 450000,
    skillsRequired: ["Java", "SQL", "HTML", "CSS"],
    eligibility: { minCGPA: 6.0, branch: "CSE, IT, ECE, EEE, Mechanical" },
    company: companyUsers[3]._id,
  },
  {
    title: "Assistant System Engineer",
    description: "Join TCS and kickstart your IT career. Work on diverse client projects and get exposure to latest technologies. Extensive training and certification programs available.",
    location: "Mumbai / Delhi / Chennai",
    salary: 400000,
    skillsRequired: ["C", "C++", "Java", "SQL"],
    eligibility: { minCGPA: 5.5, branch: "CSE, IT, ECE, EEE, Civil, Mechanical" },
    company: companyUsers[4]._id,
  },
  {
    title: "Project Engineer",
    description: "Work on digital transformation projects for global clients. Gain exposure to cloud, AI and automation technologies. Great learning environment with mentorship.",
    location: "Bangalore / Hyderabad",
    salary: 420000,
    skillsRequired: ["Python", "SQL", "Machine Learning", "Cloud"],
    eligibility: { minCGPA: 6.0, branch: "CSE, IT, ECE" },
    company: companyUsers[5]._id,
  },
  {
    title: "Software Development Engineer - Backend",
    description: "Build the technology that powers food delivery for millions of Indians. Work on real-time systems, logistics optimization and restaurant tech. High-impact role.",
    location: "Gurgaon",
    salary: 1600000,
    skillsRequired: ["Node.js", "Go", "Kafka", "Redis", "MySQL"],
    eligibility: { minCGPA: 7.0, branch: "CSE, IT" },
    company: companyUsers[6]._id,
  },
  {
    title: "SDE - Frontend",
    description: "Build the next generation of e-commerce experiences for India. Work with React, performance optimization and A/B testing at massive scale.",
    location: "Bangalore",
    salary: 1500000,
    skillsRequired: ["React", "JavaScript", "TypeScript", "CSS", "Redux"],
    eligibility: { minCGPA: 7.0, branch: "CSE, IT" },
    company: companyUsers[7]._id,
  },
  {
    title: "Data Analyst",
    description: "Analyze large datasets to generate business insights. Build dashboards and reports for leadership. Work with SQL, Python and BI tools.",
    location: "Remote",
    salary: 800000,
    skillsRequired: ["SQL", "Python", "Excel", "Power BI", "Tableau"],
    eligibility: { minCGPA: 6.5, branch: "CSE, IT, Mathematics, Statistics" },
    company: companyUsers[0]._id,
  },
  {
    title: "Machine Learning Engineer",
    description: "Build and deploy ML models at scale. Work on NLP, computer vision and recommendation systems. Collaborate with research and product teams.",
    location: "Bangalore / Remote",
    salary: 2500000,
    skillsRequired: ["Python", "TensorFlow", "PyTorch", "ML", "Deep Learning"],
    eligibility: { minCGPA: 8.0, branch: "CSE, IT, Mathematics" },
    company: companyUsers[1]._id,
  },
  {
    title: "DevOps Engineer",
    description: "Manage CI/CD pipelines, cloud infrastructure and containerization. Work with Kubernetes, Docker and cloud platforms to ensure high availability.",
    location: "Hyderabad",
    salary: 1200000,
    skillsRequired: ["Docker", "Kubernetes", "AWS", "Jenkins", "Linux"],
    eligibility: { minCGPA: 6.5, branch: "CSE, IT, ECE" },
    company: companyUsers[2]._id,
  },
  {
    title: "Full Stack Developer",
    description: "Work on both frontend and backend of our products. Build features end-to-end and take ownership. Startup culture with competitive salary.",
    location: "Delhi / Remote",
    salary: 900000,
    skillsRequired: ["React", "Node.js", "MongoDB", "Express", "TypeScript"],
    eligibility: { minCGPA: 6.0, branch: "CSE, IT" },
    company: companyUsers[6]._id,
  },
];

// Delete old demo jobs
await Job.deleteMany({ company: { $in: companyUsers.map(c => c._id) } });

// Insert new jobs
await Job.insertMany(jobs);
console.log(`✅ ${jobs.length} demo jobs added successfully!`);
console.log("🏢 Demo company login: hr@google.com / 123456");

mongoose.disconnect();
