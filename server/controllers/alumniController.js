import User from "../schemas/users.js";

// GET /alumni/search - returns only users with role 'alumni', supports basic filtering
export const searchAlumni = async (req, res) => {
  try {
    // You can add more filters from req.query as needed
    const filters = { role: "alumni" };
    if (req.query.department) filters.department = req.query.department;
    if (req.query.graduationYear) filters.graduationYear = Number(req.query.graduationYear);
    if (req.query.degreeType) filters.degreeType = req.query.degreeType;
    if (req.query.name) filters.name = { $regex: req.query.name, $options: "i" };
    // Add more filters as needed

    const alumni = await User.find(filters).select("-password");
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ message: "Error searching alumni", error: err.message });
  }
};
