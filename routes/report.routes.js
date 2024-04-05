import express from 'express';
import filterByCompany from '../controllers/getReportFilterByLocation.js';
import reportUpload from '../controllers/reportUpload.js';
import getReportsByCategory from '../controllers/getReportsByCategory.js'

const router = express.Router()


router.post('/upload', reportUpload);
router.get('/category', getReportsByCategory);
router.get('/location', filterByCompany);



export default router