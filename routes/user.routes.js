import express from 'express'

import { userSignUp, userSignIn } from '../controllers/user.js';

const router = express.Router()

router.post('/signup', userSignUp);
router.post('/signin',userSignIn);



export default router