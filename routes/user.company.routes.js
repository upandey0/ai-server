import express  from "express";
import setCompanyForUser from "../controllers/setCompanyForUser.js";
import authenticateUser from "../middlewares/authenticateUser.js";

const router = express.Router();

router.post('/setcompany',authenticateUser,setCompanyForUser)

export default router;