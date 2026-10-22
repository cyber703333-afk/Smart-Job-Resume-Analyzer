const mongoose = require("mongoose");

const STATUS_VALUES = ["Applied", "Under Review", "Shortlisted", "Selected", "Rejected"];

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: STATUS_VALUES, default: "Applied" },
    resumeOriginalName: { type: String, required: true },
    resumePath: { type: String, required: true }, // path on disk, served via /uploads

    // AI resume-matching fields (computed at apply time)
    matchScore: { type: Number, default: null }, // 0-100, null if not computable
    matchedSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
  },
  { timestamps: true }
);

// a candidate can only apply once per job
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

applicationSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    jobId: this.job,
    candidateId: this.candidate,
    status: this.status,
    resumeName: this.resumeOriginalName,
    resumeUrl: `/uploads/resumes/${this.resumePath.split("/").pop()}`,
    appliedOn: this.createdAt.toISOString().slice(0, 10),
    matchScore: this.matchScore,
    matchedSkills: this.matchedSkills,
    missingSkills: this.missingSkills,
  };
};

module.exports = mongoose.model("Application", applicationSchema);
module.exports.STATUS_VALUES = STATUS_VALUES;
