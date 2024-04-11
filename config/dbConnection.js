import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const MONGODB_URI = 'mongodb+srv://ujjwal:ujjwal123@cluster0.tl9vhar.mongodb.net/f-ai?retryWrites=true&w=majority&appName=Cluster0' || process.env.MONGODB_URI


const dbConnection = async () =>{
    try {
        const connectionInstance = await mongoose.connect(MONGODB_URI)
    } catch (e) {
        console.log(e.message)
        process.exit(1)
    }

}

export default dbConnection;