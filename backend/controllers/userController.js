import User  from '../models/User.js';
import bcrypt from 'bcryptjs';

// Get user details
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    console.log('User fetched:', user);
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};


// Update user (only password allowed)
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { name, password } = req.body;

    if (name) user.name = name;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user account
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
