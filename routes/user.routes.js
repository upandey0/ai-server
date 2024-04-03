import express from 'express'

const router = express.Router()

router.get('/api', (req,res)=>{
    res.send('<h1> Welcome From Server </h1>')
})

export default router