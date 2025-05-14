import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToMongoDB, getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  try {
    new ObjectId(id);
    return true;
  } catch (error) {
    return false;
  }
}

// GET a single memory by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get ID from params
    const { id } = params;

    // Validate ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid memory ID' }, { status: 400 });
    }

    // Connect to MongoDB using the persistent connection
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    // Find the memory by ID and user ID (for security)
    const memory = await db.collection('memories').findOne({
      _id: new ObjectId(id),
      userId
    });

    // Check if memory exists
    if (!memory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    // Format memory for response
    const formattedMemory = {
      id: memory._id.toString(),
      title: memory.title,
      content: memory.content,
      category: memory.category,
      tags: memory.tags,
      timestamp: memory.timestamp,
      userId: memory.userId
    };

    // Return the memory
    return NextResponse.json(formattedMemory);
  } catch (error) {
    console.error('Error fetching memory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memory' },
      { status: 500 }
    );
  }
}

// PATCH (update) a memory
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get ID from params
    const { id } = params;

    // Validate ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid memory ID' }, { status: 400 });
    }

    // Parse request body
    const updates = await req.json();

    // Create update object (only allow specific fields to be updated)
    const updateData: Record<string, any> = {};
    if (updates.title) updateData.title = updates.title;
    if (updates.content) updateData.content = updates.content;
    if (updates.category) updateData.category = updates.category;
    if (updates.tags) updateData.tags = updates.tags;

    // Connect to MongoDB using the persistent connection
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    // First, find the memory to ensure it belongs to the user
    const existingMemory = await db.collection('memories').findOne({
      _id: new ObjectId(id),
      userId
    });

    // Check if memory exists and belongs to the user
    if (!existingMemory) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    // Update the memory
    const result = await db.collection('memories').findOneAndUpdate(
      { _id: new ObjectId(id), userId },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    // Format the updated memory
    const updatedMemory = {
      id: result.value?._id.toString(),
      title: result.value?.title,
      content: result.value?.content,
      category: result.value?.category,
      tags: result.value?.tags,
      timestamp: result.value?.timestamp,
      userId: result.value?.userId
    };

    // Return the updated memory
    return NextResponse.json(updatedMemory);
  } catch (error) {
    console.error('Error updating memory:', error);
    return NextResponse.json(
      { error: 'Failed to update memory' },
      { status: 500 }
    );
  }
}

// DELETE a memory
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get ID from params (using destructuring directly to fix the async params issue)
    const { id } = params;

    // Validate ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid memory ID' }, { status: 400 });
    }

    // Connect to MongoDB using the persistent connection
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    // Delete the memory (only if it belongs to the user)
    const result = await db.collection('memories').deleteOne({
      _id: new ObjectId(id),
      userId
    });

    // Check if memory was deleted
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting memory:', error);
    return NextResponse.json(
      { error: 'Failed to delete memory' },
      { status: 500 }
    );
  }
}
