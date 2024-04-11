import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const MONGODB_URI = 'mongodb+srv://ujjwal:ujjwalPanda%400@cluster0.pws4qqn.mongodb.net/f-ai?retryWrites=true&w=majority' || process.env.MONGODB_URI


const dbConnection = async () =>{
    try {
        const connectionInstance = await mongoose.connect(MONGODB_URI)
    } catch (e) {
        console.log(e.message)
        process.exit(1)
    }

}

export default dbConnection;