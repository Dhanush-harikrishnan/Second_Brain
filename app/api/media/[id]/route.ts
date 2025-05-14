import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    // Get media ID from params
    const id = params.id;

    // Validate ID format
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid media ID' }, { status: 400 });
    }

    // Connect to MongoDB
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Find the media item (and ensure it belongs to the user)
    const mediaItem = await db.collection('media').findOne({
      _id: new ObjectId(id),
      userId
    });

    if (!mediaItem) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Extract public_id from URL to delete from Cloudinary
    const urlParts = mediaItem.url.split('/');
    const filenameWithExtension = urlParts[urlParts.length - 1];
    const publicId = filenameWithExtension.split('.')[0]; // Remove extension
    const folderPath = urlParts.slice(urlParts.indexOf('neurofluent')).join('/').split('.')[0];

    // Delete from Cloudinary
    const deleteResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        folderPath, 
        { resource_type: mediaItem.type === 'video' ? 'video' : 'image' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    // Delete from database
    await db.collection('media').deleteOne({
      _id: new ObjectId(id),
      userId
    });

    // Also update any memories that have this media item
    await db.collection('memories').updateMany(
      { userId, "media.id": id },
      { $pull: { media: { id } } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    );
  }
} 