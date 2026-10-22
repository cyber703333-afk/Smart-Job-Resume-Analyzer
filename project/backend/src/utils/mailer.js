const nodemailer = require("nodemailer");
const User = require("../models/User");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null; // email not configured — caller should skip silently
  }
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

// Sends a "your application status changed" email.
// If SMTP env vars aren't set, this silently does nothing — so the app
// works out of the box, and email becomes "active" the moment you add
// real SMTP credentials to .env.
async function sendStatusEmail({ candidateId, jobTitle, status }) {
  try {
    const t = getTransporter();
    if (!t) return;

    const candidate = await User.findById(candidateId);
    if (!candidate?.email) return;

    await t.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: candidate.email,
      subject: `Your application for "${jobTitle}" is now ${status}`,
      text: `Hi ${candidate.name},\n\nYour application for "${jobTitle}" has been updated to: ${status}.\n\nLog in to the Smart Job & Recruitment Management Platform to see more details.\n\n— Smart Job Platform`,
    });
  } catch (err) {
    // Email is a nice-to-have, never let it break the main request.
    console.error("Failed to send status email:", err.message);
  }
}

// Sends a simple "application received" confirmation.
async function sendApplicationConfirmation({ candidateId, jobTitle }) {
  try {
    const t = getTransporter();
    if (!t) return;

    const candidate = await User.findById(candidateId);
    if (!candidate?.email) return;

    await t.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: candidate.email,
      subject: `Application received: ${jobTitle}`,
      text: `Hi ${candidate.name},\n\nWe've received your application for "${jobTitle}". You can track its status anytime from your dashboard.\n\n— Smart Job Platform`,
    });
  } catch (err) {
    console.error("Failed to send confirmation email:", err.message);
  }
}

module.exports = { sendStatusEmail, sendApplicationConfirmation };
