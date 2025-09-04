import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    age: {
        type: Number,
        required: false
    },
    password: {
        type: String,
        required: true
    }
});

export const User = mongoose.model('User', userSchema);