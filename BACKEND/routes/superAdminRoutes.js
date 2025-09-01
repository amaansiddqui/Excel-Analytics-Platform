import express from 'express';
import {
  promoteToAdmin,
  demoteAdmin,
  getAllAdmins,
  getSystemStats,
  deleteAdmin,
  getUserDetails
} from '../controllers/superAdminController.js';
import authenticate from '../middleware/auth.js';
import superAdminMiddleware from '../middleware/superAdminMiddleware.js';

const router = express.Router();

// All routes require superadmin access
router.use(authenticate);
router.use(superAdminMiddleware);

// User management
router.put('/users/:userId/promote', promoteToAdmin);
router.put('/users/:userId/demote', demoteAdmin);
router.delete('/admins/:userId', deleteAdmin);
router.get('/admins', getAllAdmins);
router.get('/users/:userId', getUserDetails);

// System statistics
router.get('/stats', getSystemStats);

export default router;
