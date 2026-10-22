const fs = require("fs");
const path = require("path");

// Extracts plain text from an uploaded resume so it can be fed into the
// skill-matching algorithm. Supports PDF and DOCX; falls back to empty
// text for other types (match score will simply be null in that case).
async function extractResumeText(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  try {
    if (ext === ".pdf") {
      const pdfParse = require("pdf-parse");
      const buffer = fs.readFileSync(filePath);
      const data = await pdfParse(buffer);
      return data.text || "";
    }

    if (ext === ".docx") {
      const mammoth = require("mammoth");
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value || "";
    }

    // .doc (legacy binary Word) has no reliable pure-JS parser — skip text extraction.
    return "";
  } catch (err) {
    console.error("Resume text extraction failed:", err.message);
    return "";
  }
}

module.exports = { extractResumeText };
