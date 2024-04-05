import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from './routes/user.routes.js'
import companyRoutes from './routes/user.company.routes.js'
import fileRoutes from './routes/fileRoutes.js';


// Application Instance : 
const app = express()

app.use(express.json())
app.use(cors( {
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(cookieParser())
app.use(express.urlencoded({extended: true, limit: "32kb"}))
app.use(express.static("public"))

app.use('/api/user', userRouter);
app.use('/api/companies',companyRoutes)


export default app;