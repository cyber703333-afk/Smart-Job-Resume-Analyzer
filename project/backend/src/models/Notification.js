const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    candidateId: this.candidate,
    message: this.message,
    read: this.read,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("Notification", notificationSchema);
