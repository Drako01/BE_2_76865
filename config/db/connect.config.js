import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const baseMongooseOpts = {
    serverSelectionTimeoutMS: 10000,
}

export const connectToMongoDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) throw new Error("Falta MONGO_URI en el .env");
        await mongoose.connect(uri, baseMongooseOpts);
        console.log('✅ MongoDB conectado exitosamente.!!');
    } catch (error) {
        console.error(error)
        process.exit(1);
    }
};

export const connectMongoDBAltas = async () => {
    try {
        const uri = process.env.MONGO_URI_ATLAS;
        if (!uri) throw new Error("Falta MONGO_URI_ATLAS en el .env");
        await mongoose.connect(uri, baseMongooseOpts)
        console.log('✅ MongoAltas conectado exitosamente.!!')
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

export const connectAuto = async () => {
    const target = (process.env.MONGO_TARGET || "LOCAL").toUpperCase();
    if(target === "ATLAS") return connectMongoDBAltas();
    return connectToMongoDB();
}