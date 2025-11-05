export const uploadAvatar = async (req, res) => {
  try {
    const _id = req._id;
    const { avatar } = req.body;
    if (!avatar) {
      return res.status(400).json({ message: 'No avatar image provided' });
    }
    const buffer = Buffer.from(avatar, 'base64');
    const user = await User.findByIdAndUpdate(
      _id,
      { $set: { avatar: buffer } },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({
      avatar: user.avatar ? user.avatar.toString('base64') : null,
      message: 'Avatar updated successfully'
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
import User from '../schemas/users.js';

export const getUserInfo = async (req, res) => {
  try {
    const _id = req._id;
    const user = await User.findById(_id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({
      email: user.email,
      name: user.name,
      avatar: user.avatar ? user.avatar.toString('base64') : null,
      role: user.role,
      graduationYear: user.graduationYear,
      degreeType: user.degreeType,
      department: user.department,
      areaOfExpertise: user.areaOfExpertise,
      industryDomain: user.industryDomain,
      currentLocation: user.currentLocation,
      organization: user.organization,
      status: user.status
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({
      email: user.email,
      name: user.name,
      avatar: user.avatar ? user.avatar.toString('base64') : null,
      role: user.role,
      graduationYear: user.graduationYear,
      degreeType: user.degreeType,
      department: user.department,
      areaOfExpertise: user.areaOfExpertise,
      industryDomain: user.industryDomain,
      currentLocation: user.currentLocation,
      organization: user.organization,
      status: user.status
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserInfo = async (req, res) => {
  try {
    const _id = req._id;
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated
    delete updateData.email;
    delete updateData.role;
    delete updateData.status;
    delete updateData.password;
    
    // Handle avatar upload (expects base64 string in updateData.avatar)
    if (updateData.avatar) {
      updateData.avatar = Buffer.from(updateData.avatar, 'base64');
    }
    const user = await User.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({
      email: user.email,
      name: user.name,
      avatar: user.avatar ? user.avatar.toString('base64') : null,
      role: user.role,
      graduationYear: user.graduationYear,
      degreeType: user.degreeType,
      department: user.department,
      areaOfExpertise: user.areaOfExpertise,
      industryDomain: user.industryDomain,
      currentLocation: user.currentLocation,
      organization: user.organization,
      status: user.status
    });
  } catch (error) {
    console.error("Error updating user info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};