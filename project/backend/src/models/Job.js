const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
      default: "Full-time",
    },
    salary: { type: String, default: "" },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    extractedSkills: { type: [String], default: [] }, // auto-detected from description (AI/NLP)
  },
  { timestamps: true }
);

jobSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    title: this.title,
    company: this.company,
    recruiterId: this.recruiter,
    location: this.location,
    type: this.type,
    salary: this.salary,
    description: this.description,
    requirements: this.requirements,
    extractedSkills: this.extractedSkills,
    postedOn: this.createdAt.toISOString().slice(0, 10),
  };
};

module.exports = mongoose.model("Job", jobSchema);
