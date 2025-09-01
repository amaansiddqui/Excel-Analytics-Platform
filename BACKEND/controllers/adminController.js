import User  from '../models/User.js';
import Upload from '../models/Upload.js';


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('files').lean(); // Exclude passwords

    res.json({ users});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await Upload.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User and their files deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// adminController.js

export const deleteUserFileByAdmin = async (req, res) => {
 const { userId, fileId } = req.params;

  try {
    // Optional: Check if file belongs to userId
    const file = await Upload.findOne({ _id: fileId, userId: userId });
    if (!file) return res.status(404).json({ message: "File not found" });

    await Upload.findByIdAndDelete(fileId);

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete file error:", error);
    res.status(500).json({ message: "Failed to delete file" });
  }
};


export const getAllUsersWithFiles = async (req, res) => {
  try {
    const users = await User.find();

    const usersWithFiles = await Promise.all(
      users.map(async (user) => {
        const files = await Upload.find({ userId: mongoose.Types.ObjectId(user._id) });
        return { ...user.toObject(), files };
      })
    );

    res.status(200).json({ users: usersWithFiles });
  } catch (err) {
    console.error("Error fetching users with files:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// New endpoint for admin dashboard
export const getAdminDashboardStats = async (req, res) => {
  try {
    // Get total registered users count
    const totalUsers = await User.countDocuments();
    
    // Get users registered today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const usersToday = await User.countDocuments({ createdAt: { $gte: today } });
    
    // Get users registered this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const usersThisWeek = await User.countDocuments({ createdAt: { $gte: weekAgo } });
    
    // Get users registered this month
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const usersThisMonth = await User.countDocuments({ createdAt: { $gte: monthAgo } });
    
    // Get recent users (last 10)
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    
    // Get total uploads count
    const totalUploads = await Upload.countDocuments();
    
    // Get upload statistics
    const uploadsToday = await Upload.countDocuments({ createdAt: { $gte: today } });
    const uploadsThisWeek = await Upload.countDocuments({ createdAt: { $gte: weekAgo } });
    const uploadsThisMonth = await Upload.countDocuments({ createdAt: { $gte: monthAgo } });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        usersToday,
        usersThisWeek,
        usersThisMonth,
        totalUploads,
        uploadsToday,
        uploadsThisWeek,
        uploadsThisMonth
      },
      recentUsers,
      message: 'Admin dashboard data retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch admin dashboard data' 
    });
  }
};
