import mongoose from "mongoose";

export const connectToMongoDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/backend2');
        console.log('✅ MongoDB conectado exitosamente.!!');
    } catch (error) {
        console.error(error)
        process.exit(1);
    }
};

export const connectMongoDBAltas = async () => {
    try {
        await mongoose.connect('mongodb+srv://aleddistefano:ZWKtmXYJ1ozfXgmN@codehouse.cfacxsr.mongodb.net/')
        console.log('✅ MongoAltas conectado exitosamente.!!')
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};