import User from '../models/User.js';
import Upload from '../models/Upload.js';

// Promote user to admin
export const promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { role: 'admin' },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User promoted to admin successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Demote admin to user
export const demoteAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { role: 'user' },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Admin demoted to user successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password');
    res.json({ admins });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get system statistics
export const getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalSuperadmins = await User.countDocuments({ role: 'superadmin' });
    const totalUploads = await Upload.countDocuments();
    
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const uploadsByUser = await Upload.aggregate([
      { $group: { _id: '$userId', uploadCount: { $sum: 1 } } },
      { $sort: { uploadCount: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      totalUsers,
      totalAdmins,
      totalSuperadmins,
      totalUploads,
      usersByRole,
      topUploaders: uploadsByUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete admin (demote to user)
export const deleteAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Prevent self-deletion
    if (userId === req.user._id) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role: 'user' },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Admin deleted (demoted to user)', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user details with files
export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const files = await Upload.find({ userId });
    
    res.json({ user, files });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
