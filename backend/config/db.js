import mongoose from "mongoose";

const connectDB = async () => {
  const { MONGO_URI } = process.env;

  if (!MONGO_URI || MONGO_URI === "your_mongodb_connection") {
    throw new Error(
      "MONGO_URI is missing. Update backend/.env with a valid MongoDB connection string.",
    );
  }

  const conn = await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 20000,
    maxPoolSize: 10,
  });
  console.log(`MongoDB connected: ${conn.connection.host}`);
};

export default connectDB;
