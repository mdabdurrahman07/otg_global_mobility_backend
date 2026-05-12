import mongoose from "mongoose";

let cachedConnection = null;

const connectDB = async () => {
  // Return cached connection if it exists and is connected
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log("✅ Using cached MongoDB connection");
    return cachedConnection;
  }

  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`, {
      maxPoolSize: 2,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      waitQueueTimeoutMS: 20000,
      family: 4,
      retryWrites: true,
      retryReads: true,
    });
    
    // Cache the connection for reuse in serverless
    cachedConnection = connectionInstance;
    
    console.log(`\n✅ MongoDB Connected! DB Host: ${connectionInstance.connection.host}`);
    return connectionInstance;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    cachedConnection = null;
    throw error;
  }
};

export default connectDB;
