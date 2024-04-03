import dotenv from 'dotenv'
dotenv.config()
import app from './app.js'
import dbConnection from './config/dbConnection.js'


// database connection initialized : 
dbConnection();

// listen of server : 

app.listen(process.env.PORT, ()=>{
    console.log('server started at port ' , process.env.PORT)
})