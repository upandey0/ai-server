import express from 'express';
import filterByCompany from '../controllers/getReportFilterByLocation.js';
import reportUpload from '../controllers/reportUpload.js';
import getReportsByCategory from '../controllers/getReportsByCategory.js'
import authenticateUser from '../middlewares/authenticateUser.js';

const router = express.Router()


router.post('/upload', authenticateUser, reportUpload);
router.get('/category', authenticateUser, getReportsByCategory);
router.get('/location', authenticateUser, filterByCompany);



export default router