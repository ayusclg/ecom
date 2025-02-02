import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()
 const connectDb = async function(){
    try {
        const mongoInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log('MONGO DB CONNECTED !!' , mongoInstance.connection.host)
    } catch (error) {
        console.log('Error Occured while connecting database',error)
        process.exit(1)
    }
}

export default connectDb