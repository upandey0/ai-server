import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from './routes/user.routes.js'

// Application Instance : 
const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({extended: true, limit: "32kb"}))
app.use(express.static("public"))

app.use('/', userRouter);


export default app;