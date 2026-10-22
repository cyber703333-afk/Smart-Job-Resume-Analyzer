const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);





// Run with: npm run seed
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Job = require("../models/Job");

const demoUsers = [
  { name: "Aman Verma", email: "aman@example.com", password: "1234", role: "candidate" },
  { name: "Priya Sharma", email: "priya@techcorp.com", password: "1234", role: "recruiter", company: "TechCorp Solutions" },
  { name: "Admin", email: "admin@platform.com", password: "1234", role: "admin" },
];

async function seed() {
  await connectDB();

  await User.deleteMany({});
  await Job.deleteMany({});

  const [aman, priya] = await User.create(demoUsers);

  await Job.create([
    {
      title: "Frontend Developer Intern",
      company: "TechCorp Solutions",
      recruiter: priya._id,
      location: "Ludhiana, Punjab",
      type: "Internship",
      salary: "₹15,000/month",
      description:
        "Work with our web team building responsive interfaces in React. Great fit for final-year students comfortable with HTML, CSS and JavaScript.",
      requirements: ["HTML/CSS/JavaScript", "Basic React knowledge", "Good communication skills"],
    },
    {
      title: "Backend Developer (Node.js)",
      company: "TechCorp Solutions",
      recruiter: priya._id,
      location: "Remote",
      type: "Full-time",
      salary: "₹5,00,000/year",
      description:
        "Build and maintain REST APIs powering our recruitment platform. Experience with Express and MongoDB preferred.",
      requirements: ["Node.js & Express", "MongoDB", "REST API design"],
    },
    {
      title: "MERN Stack Trainee",
      company: "Brightwave IT",
      recruiter: priya._id,
      location: "Chandigarh",
      type: "Full-time",
      salary: "₹3,60,000/year",
      description:
        "Entry-level role for graduates who have built at least one full-stack project. Training provided on our internal tools.",
      requirements: ["React basics", "Any backend framework", "Willingness to learn"],
    },
  ]);

  console.log("Seed complete:");
  console.log("  Candidate -> aman@example.com / 1234");
  console.log("  Recruiter -> priya@techcorp.com / 1234");
  console.log("  Admin     -> admin@platform.com / 1234");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
