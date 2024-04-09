import express from 'express'

import { userSignUp, userSignIn, userLogOut } from '../controllers/user.js';

const router = express.Router()

router.post('/signup', userSignUp);
router.post('/signin',userSignIn);
router.get('/logout',userLogOut);



export default router