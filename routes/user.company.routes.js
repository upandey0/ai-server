import express  from "express";
import setCompanyForUser from "../controllers/setCompanyForUser.js";
// import authenticateUser from "../middlewares/authenticateUser.js";

const router = express.Router();

router.post('/:userId/companies',setCompanyForUser)

export default router;