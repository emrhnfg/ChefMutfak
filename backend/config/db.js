import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://fatihgunay:fatih2001810@cluster0.ubwxe.mongodb.net/food-del').then(()=>console.log("DB Connected"))
}