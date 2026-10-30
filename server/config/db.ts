import mongoose from "mongoose";
import AutoReplySettings from "../Models/AutoReplyModel.js";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", async () => {
            console.log("MongoDB connected");
        });
        await mongoose.connect(process.env.MONGODB_URI!);
        await AutoReplySettings.syncIndexes();
        console.log("Auto-reply indexes synchronized");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default connectDB;