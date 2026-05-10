import express from 'express';
import multer from 'multer';
import authMiddleware from '../middleware/auth.js';
import { generateInsight } from '../controllers/insightController.js';

const router = express.Router();
const upload = multer(); // memory storage


router.post('/files/:id', authMiddleware, generateInsight);


export default router;
