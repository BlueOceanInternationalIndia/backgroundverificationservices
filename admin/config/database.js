import 'dotenv/config';
import mongoose from 'mongoose';

const connectDB = async () => await mongoose.connect(process.env.MONGODB_URI.toString()).then((connData) => {
        console.log(`App connected to database ${connData.connection.host}`);
        return true     
    }).catch((err) => {
        console.log('Database connection failed. Error:\n', err);
        return false
    });


export default connectDB