import express from 'express'

import { userSignUp, userSignIn, userLogOut, handleRefresh } from '../controllers/user.js';

const router = express.Router()

router.post('/signup', userSignUp);
router.post('/signin',userSignIn);
router.get('/logout',userLogOut);
router.get('/refresh', handleRefresh);



export default router