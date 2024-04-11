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
    origin: "https://test-theta-livid-88.vercel.app/",
    methods: ["GET","POST"],
    credentials: true
}))
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      // Handle preflight requests by responding with appropriate CORS headers
      res.setHeader('Access-Control-Allow-Origin', 'https://fa-ai-client-dashboard.vercel.app');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(200).end();
    }
    next();
  });
app.use(cookieParser())
app.use(express.urlencoded({extended: true, limit: "32kb"}))
app.use(express.static("public"))

app.use('/api/user', userRouter);
app.use('/api/companies',companyRoutes)
app.use('/api/files', fileRoutes);

app.use('/api/user/report',reportRoutes)


export default app;