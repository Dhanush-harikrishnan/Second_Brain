import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const db = await connectToDatabase();
    
    return NextResponse.json({ 
      success: true, 
      message: "MongoDB connection successful!",
      db: db ? "Connected" : "Not connected"
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
