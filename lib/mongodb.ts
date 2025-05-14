import { MongoClient, Db } from 'mongodb';

// MongoDB connection string
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/neurofluent';

// Database name
const dbName = 'neurofluent';

// MongoDB connection options
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
};

// Global variables to cache the MongoDB connection
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

/**
 * Connect to MongoDB and return the database instance
 * This creates a persistent connection that is reused across requests
 */
export async function connectToMongoDB() {
  // If we already have a connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Create a new connection
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  try {
    const client = new MongoClient(uri, options);
    await client.connect();
    const db = client.db(dbName);

    // Cache the connection for future use
    cachedClient = client;
    cachedDb = db;

    // Add connection error handler
    client.on('error', (error) => {
      console.error('MongoDB connection error:', error);
      cachedClient = null;
      cachedDb = null;
    });

    console.log('Connected to MongoDB');
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

/**
 * Get the MongoDB database instance
 * This should be used in API routes instead of creating new connections
 */
export async function getDatabase() {
  if (!cachedDb) {
    await connectToMongoDB();
  }
  return cachedDb;
}

/**
 * Get a MongoDB collection
 */
export function getCollection(collectionName: string) {
  if (!cachedDb) {
    throw new Error('Database connection not established');
  }
  return cachedDb.collection(collectionName);
}

// Only use this in development for testing or when shutting down the server
export async function closeMongoDBConnection() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log('MongoDB connection closed');
  }
}
