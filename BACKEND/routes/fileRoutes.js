import express from 'express';
import multer from 'multer';
import {
  uploadFile,
  getUploadHistory,
  viewFileById,
  downloadFileById,
  deleteFileById,getUserFiles
} from '../controllers/fileController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', authMiddleware, upload.single('file'), uploadFile);
router.get('/history', authMiddleware, getUploadHistory);
router.get('/view/:id', authMiddleware, viewFileById);
router.get('/download/:id', authMiddleware, downloadFileById);
router.delete('/delete/:id', authMiddleware, deleteFileById);
router.get('/', authMiddleware, getUserFiles);

export default router;