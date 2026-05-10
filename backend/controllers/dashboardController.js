// dashboardController.js
import Upload from '../models/Upload.js';
import mongoose from 'mongoose';

export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const uploads = await Upload.find({ userId });

    const totalFiles = uploads.length;
    const successfulUploads = uploads.filter(file => file.data?.length > 0).length;
    const failedUploads = totalFiles - successfulUploads;

    res.json({ totalFiles, successfulUploads, failedUploads });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get dashboard summary' });
  }
};

export const getRecentUploads = async (req, res) => {
  try {
    const userId = req.user.id;
    const uploads = await Upload.find({ userId }).sort({ createdAt: -1 }).limit(5);

    const recentUploads = uploads.map(upload => ({
      name: upload.filename,
      date: new Date(upload.createdAt).toLocaleDateString(),
      status: upload.data?.length > 0 ? 'uploaded' : 'failed',
    }));

    res.json(recentUploads);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recent uploads' });
  }
};

export const getChartData = async (req, res) => {
  try {
    const userId = req.user.id;
    const uploads = await Upload.find({ userId });

    const uploaded = uploads.filter(file => file.data?.length > 0).length;
    const failed = uploads.length - uploaded;

    const chartData = {
      labels: ['Uploaded', 'Failed'],
      data: [uploaded, failed],
    };

    res.json(chartData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
};

// controllers/dashboardController.js

export const getUploadTrends = async (req, res) => {
  try {
    const userId = req.user.id;
    const days = 30; // Change this to 7 or any other value if needed

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const trends = await Upload.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId), // ensure ObjectId match
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          successful: {
            $sum: { $cond: [{ $eq: ["$status", "uploaded"] }, 1, 0] },
          },
          failed: {
            $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const labels = trends.map((t) => t._id);
    const successfulUploads = trends.map((t) => t.successful);
    const failedUploads = trends.map((t) => t.failed);

    console.log("📈 Upload Trends Result:", trends); // For debugging

    res.status(200).json({ labels, successfulUploads, failedUploads });
  } catch (error) {
    console.error("❌ Error fetching upload trends:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
