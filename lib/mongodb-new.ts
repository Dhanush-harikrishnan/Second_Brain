import mongoose, { Schema } from 'mongoose';
import { Memory } from '@/types/memory';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Define global mongoose type
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Connection cache
let cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds timeout
    };

    try {
      cached.promise = mongoose.connect(MONGODB_URI as string, opts)
        .then((mongoose) => {
          console.log('Connected to MongoDB');
          return mongoose;
        })
        .catch(err => {
          console.error('MongoDB connection error:', err);
          cached.promise = null;
          throw err;
        });
    } catch (error) {
      console.error('Error initiating MongoDB connection:', error);
      cached.promise = null;
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('Error while waiting for MongoDB connection:', error);
    cached.promise = null;
    throw error;
  }
}

// Memory Schema
const MemorySchema = new Schema<Memory>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  timestamp: { type: Date, default: Date.now },
  userId: { type: String, required: true }, // Added to associate memories with users
});

export const MemoryModel = mongoose.models.Memory || mongoose.model<Memory>('Memory', MemorySchema);
