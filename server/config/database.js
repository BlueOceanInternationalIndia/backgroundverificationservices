import 'dotenv/config';
import mongoose from 'mongoose';

const connectDB = async () => {
    const status = await mongoose.connect(process.env.MONGODB_URI.toString()).then((connData) => {
        console.log(`App connected to database ${connData.connection.host}`);
        return true     
    }).catch((err) => {
        console.log(`Database connection failed.\nError: ${err}`);
        return false
    });
    return status
};

export default connectDB