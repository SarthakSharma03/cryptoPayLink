import mongoose from "mongoose";

async function connectDb(): Promise<void> {
  const uri = process.env.MONGO_URL;
  if (!uri) {
    throw new Error("MONGO_URL environment variable is not defined");
  }
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}

export default connectDb;
