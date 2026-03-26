import mongoose from "mongoose";

const connectDB = async () => {
  const { MONGO_URI } = process.env;

  if (!MONGO_URI || MONGO_URI === "your_mongodb_connection") {
    throw new Error(
      "MONGO_URI is missing. Update backend/.env with a valid MongoDB connection string.",
    );
  }

  const conn = await mongoose.connect(MONGO_URI);
  console.log(`MongoDB connected: ${conn.connection.host}`);
};

export default connectDB;
