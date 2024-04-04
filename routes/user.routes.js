import express from 'express'

import { userSignUp } from '../controllers/user.js';

const router = express.Router()

router.post('/api/user/signup', userSignUp);



export default router