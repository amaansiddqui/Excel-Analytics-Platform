import express from 'express';
import authMiddleware from '../middleware/auth.js';
import checkRole from '../middleware/checkRole.js';
import { getDashboardSummary, getRecentUploads, getChartData, getUploadTrends } from '../controllers/dashboardController.js';

const router = express.Router();

// Admin-only route
router.get('/admin', authMiddleware, checkRole('admin'), (req, res) => {
  res.json({
    msg: 'Welcome, admin!',
    user: req.user,
  });
});

router.get('/user', authMiddleware, checkRole('user'), (req, res) => {
  res.json({
    msg: 'Welcome User!',
    user: req.user,
  });
});

router.get('/summary', authMiddleware, getDashboardSummary);
router.get('/recent-uploads', authMiddleware, getRecentUploads);
router.get('/chart-data', authMiddleware, getChartData);
router.get("/upload-trends", authMiddleware, getUploadTrends);

export default router;
