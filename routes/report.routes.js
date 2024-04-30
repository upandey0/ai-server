import express from 'express';
import filterByCompany from '../controllers/getReportFilterByLocation.js';
import reportUpload from '../controllers/reportUpload.js';
import getReportsByCategory from '../controllers/getReportsByCategory.js'
import authenticateUser from '../middlewares/authenticateUser.js';
import { upload, handleFileUploadError  } from '../middlewares/multer.js';
import { handleFileUpload } from '../controllers/fileController.js';

const router = express.Router()


router.post('/upload', authenticateUser, upload.single('file'), handleFileUpload);
router.get('/category', authenticateUser, getReportsByCategory);
router.get('/location', authenticateUser, filterByCompany);



export default router