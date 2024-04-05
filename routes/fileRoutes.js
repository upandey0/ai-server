import express from 'express';
import { upload, handleFileUploadError  } from '../middlewares/multer.js';
import { uploadFile } from '../controllers/fileController.js';

const router = express.Router();

// Route for uploading a file
router.post('/upload', upload.single('file'), handleFileUploadError, uploadFile, );

export default router;
