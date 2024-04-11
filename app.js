import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from './routes/user.routes.js'
import companyRoutes from './routes/user.company.routes.js'
import reportRoutes from './routes/report.routes.js'
import fileRoutes from './routes/fileRoutes.js';


// Application Instance : 
const app = express()

app.use(express.json())
app.use(cors( {
    origin: process.env.ORIGIN,
    credentials: true
}))
app.use(cookieParser())
app.use(express.urlencoded({extended: true, limit: "32kb"}))
app.use(express.static("public"))

app.use('/api/user', userRouter);
app.use('/api/companies',companyRoutes)
app.use('/api/files', fileRoutes);

app.use('/api/user/report',reportRoutes)


export default app;