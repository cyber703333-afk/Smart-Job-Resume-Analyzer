const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Run with: node src/utils/seedJobs.js
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Job = require("../models/Job");

const roles = [
  { title: "React Developer", type: "Full-time", skills: ["React", "JavaScript", "REST APIs"] },
  { title: "Node.js Developer", type: "Full-time", skills: ["Node.js", "Express", "MongoDB"] },
  { title: "Full Stack Developer", type: "Full-time", skills: ["React", "Node.js", "MongoDB"] },
  { title: "UI/UX Designer", type: "Full-time", skills: ["Figma", "Wireframing", "Prototyping"] },
  { title: "Python Developer", type: "Full-time", skills: ["Python", "Django/Flask", "SQL"] },
  { title: "Data Analyst", type: "Full-time", skills: ["SQL", "Excel", "Power BI"] },
  { title: "DevOps Engineer", type: "Full-time", skills: ["Docker", "CI/CD", "AWS"] },
  { title: "QA Tester", type: "Full-time", skills: ["Manual testing", "Selenium", "Bug tracking"] },
  { title: "Web Development Intern", type: "Internship", skills: ["HTML/CSS", "JavaScript", "Git"] },
  { title: "Digital Marketing Intern", type: "Internship", skills: ["SEO", "Social media", "Content writing"] },
  { title: "Android Developer Intern", type: "Internship", skills: ["Java/Kotlin", "Android Studio", "Firebase"] },
  { title: "Machine Learning Intern", type: "Internship", skills: ["Python", "Pandas", "Scikit-learn"] },
];

const companies = ["TechCorp Solutions", "Brightwave IT", "CodeNest Labs", "PixelCraft Studio", "InnoSoft Systems"];
const locations = ["Ludhiana, Punjab", "Chandigarh", "Delhi", "Remote", "Bengaluru", "Pune", "Mohali"];

const salaryFor = (type, i) =>
  type === "Internship"
    ? `₹${10000 + (i % 4) * 2500}/month`
    : `₹${3 + (i % 8)},00,000/year`;

async function seedJobs() {
  await connectDB();

  const recruiter = await User.findOne({ role: "recruiter" });
  if (!recruiter) {
    console.log("Koi recruiter nahi mila. Pehle recruiter account banao.");
    process.exit(1);
  }

  const jobs = [];
  for (let i = 0; i < 36; i++) {
    const r = roles[i % roles.length];
    const company = companies[i % companies.length];
    jobs.push({
      title: r.title,
      company,
      recruiter: recruiter._id,
      location: locations[i % locations.length],
      type: r.type,
      salary: salaryFor(r.type, i),
      description: `${company} is hiring a ${r.title}. You will work with a friendly team on real projects and grow your skills.`,
      requirements: r.skills,
    });
  }

  await Job.insertMany(jobs);
  console.log(`${jobs.length} jobs added (recruiter: ${recruiter.email})`);

  await mongoose.disconnect();
  process.exit(0);
}

seedJobs().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});