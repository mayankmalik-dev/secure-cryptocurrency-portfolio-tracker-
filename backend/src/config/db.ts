import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

const connectDB = async () => {
  try {
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/crypto-portfolio';
    
    // Attempt to connect to the provided URI
    console.log('Attempting to connect to MongoDB...');
    
    try {
      const conn = await mongoose.connect(dbUri, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (localError) {
      console.warn('Local MongoDB not found or connection refused. Starting in-memory database for development...');
      
      // Fallback to MongoMemoryServer
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      
      const conn = await mongoose.connect(uri);
      console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
      console.log('NOTE: Data will be lost when the server stops.');
    }
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;
