import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToMongoDB, getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET handler to fetch all memories for the authenticated user
export async function GET(req: NextRequest) {
  try {
    // Verify user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB using the persistent connection
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    // Fetch memories from database
    const memories = await db.collection('memories')
      .find({ userId })
      .sort({ timestamp: -1 }) // Sort by newest first
      .toArray();
    
    // Transform _id to id for client-side consistency
    const formattedMemories = memories.map(memory => ({
      id: memory._id.toString(),
      title: memory.title,
      content: memory.content,
      category: memory.category,
      tags: memory.tags,
      timestamp: memory.timestamp,
      userId: memory.userId
    }));

    // Return the memories
    return NextResponse.json({ memories: formattedMemories });
  } catch (error) {
    console.error('Error fetching memories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memories' },
      { status: 500 }
    );
  }
}

// POST handler to create a new memory
export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { title, content, category, tags, media } = await req.json();

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      );
    }

    // Create memory object
    const newMemory = {
      title,
      content,
      category,
      tags: tags || [],
      media: media || [], // Include media array (can be empty)
      timestamp: new Date().toISOString(),
      userId
    };

    // Connect to MongoDB using the persistent connection
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    // Insert new memory into database
    const result = await db.collection('memories').insertOne(newMemory);
    
    // Get the created memory with the assigned _id
    const createdMemory = {
      id: result.insertedId.toString(),
      ...newMemory
    };

    // Return the created memory
    return NextResponse.json(createdMemory, { status: 201 });
  } catch (error) {
    console.error('Error creating memory:', error);
    return NextResponse.json(
      { error: 'Failed to create memory' },
      { status: 500 }
    );
  }
}
