import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI


const dbConnection = async () =>{
    try {
        const connectionInstance = await mongoose.connect(MONGODB_URI)
    } catch (e) {
        console.log(e.message)
        process.exit(1)
    }

}

export default dbConnection;