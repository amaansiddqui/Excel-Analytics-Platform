import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
  getUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

router.get('/', authMiddleware, getUser);
router.put('/', authMiddleware, updateUser);
router.delete('/', authMiddleware, deleteUser);



export default router;
