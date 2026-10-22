async function updateProfile(req, res) {
  try {
    const { name, education, skills } = req.body;
    if (name !== undefined) req.user.name = name;
    if (education !== undefined) req.user.education = education;
    if (skills !== undefined) req.user.skills = skills;

    await req.user.save();
    res.json({ user: req.user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile.", error: err.message });
  }
}

module.exports = { updateProfile };
