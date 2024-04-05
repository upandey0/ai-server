import express from 'express';
// import authenticateUser from '../middlewares/authenticateUser.js';
// import reportArrangement from '../controllers/reportArrangement.js';
import filterByCompany from '../controllers/getReportFilterByLocation.js';
import reportUpload from '../controllers/reportUpload.js';
import getReportsByCategory from '../controllers/getReportsByCategory.js'

const router = express.Router()

// router.get('/api/user/report', authenticateUser , reportArrangement);

// router.get('/api/user/report/company', authenticateUser, getReportsByLocation);

router.post('/upload', reportUpload);
router.get('/category', getReportsByCategory);
router.get('/location', filterByCompany);



export default router