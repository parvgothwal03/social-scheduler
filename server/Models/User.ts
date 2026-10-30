import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // Keep any other specific fields you need (e.g., plan, avatar, role)
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);