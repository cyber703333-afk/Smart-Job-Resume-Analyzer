const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    application: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    proposedSlots: { type: [Date], required: true }, // 2-4 candidate time options
    confirmedSlot: { type: Date, default: null },
    status: { type: String, enum: ["Proposed", "Confirmed", "Cancelled"], default: "Proposed" },
    notes: { type: String, default: "" }, // e.g. meeting link or location
  },
  { timestamps: true }
);

interviewSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    applicationId: this.application,
    jobId: this.job,
    recruiterId: this.recruiter,
    candidateId: this.candidate,
    proposedSlots: this.proposedSlots,
    confirmedSlot: this.confirmedSlot,
    status: this.status,
    notes: this.notes,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("Interview", interviewSchema);
