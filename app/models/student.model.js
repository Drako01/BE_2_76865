import mongoose from "mongoose";

const studentShema = new mongoose.Schema({

    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    age: {
        type: Number,
        require: false
    },

});

export const Student = mongoose.model('Student', studentShema);