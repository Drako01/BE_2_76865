import mongoose from "mongoose";

export const connectToMongoDB = async () => {
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/backend76865');
        console.log(`✅ MongoDB conectado Exitosamente.!!!`);
    }catch(error){
        console.error(error);
        process.exit(1);
    }
};

export const connectToMongoDBAtlas = async () => {
    try{
        await mongoose.connect('mongodb+srv://aleddistefano:RKFlB0qXvqjqQm8z@codehouse.cfacxsr.mongodb.net/');
        console.log(`✅ MongoDB Atlas conectado Exitosamente.!!!`);
    }catch(error){
        console.error(error);
        process.exit(1);
    }
}