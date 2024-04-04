import express from 'express';
import authenticateUser from '../middlewares/authenticateUser';
import reportArrangement from '../controllers/reportArrangement';
import getReportsByCompany from '../controllers/getReportFilterByLocation';

const router = express.Router()

router.get('/api/user/report', authenticateUser , reportArrangement);
      
router.get('/api/user/report/company', authenticateUser, getReportsByCompany);


export default router