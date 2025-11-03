import mongoose from "mongoose"

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected succesfully💫");
        
    } catch (error) {
         console.log("Error connecting to mongoDB:",error.message);
         process.exit()
          
    }
}

export default connectDB;