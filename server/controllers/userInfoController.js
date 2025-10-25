export const getUserInfo = async (req, res) => {
  try {
    const _id = req._id
    const user = await User.findById(_id);
    res.status(200).json({ email: user.email, name: user.name, image: user.image });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
