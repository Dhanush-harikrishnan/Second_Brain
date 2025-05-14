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

export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get form data from request
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const caption = formData.get('caption') as string || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check file size (limit to 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 50MB limit' },
        { status: 400 }
      );
    }

    // Determine media type (image or video)
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      return NextResponse.json(
        { error: 'Unsupported file type. Only images and videos are allowed.' },
        { status: 400 }
      );
    }

    // Convert file to buffer for Cloudinary upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Convert buffer to base64 for Cloudinary
    const base64Data = buffer.toString('base64');
    const fileStr = `data:${file.type};base64,${base64Data}`;

    // Set resource type based on file type
    const resourceType = isVideo ? 'video' : 'image';
    
    // Set upload options (including transformation for videos to create thumbnails)
    const uploadOptions = {
      resource_type: resourceType,
      folder: `neurofluent/${userId}`,
      public_id: `${Date.now()}-${file.name.replace(/\s+/g, '-')}`,
    };
    
    if (isVideo) {
      // Add video transformation for thumbnail generation
      Object.assign(uploadOptions, {
        eager: [
          { width: 300, height: 300, crop: "fill", format: "jpg" }
        ]
      });
    }

    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(fileStr, uploadOptions, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    const result: any = uploadResponse;

    // Create media item
    const mediaItem = {
      id: new ObjectId().toString(),
      type: isVideo ? 'video' : 'image',
      url: result.secure_url,
      thumbnailUrl: isVideo ? result.eager[0].secure_url : undefined,
      mimeType: file.type,
      caption: caption,
      createdAt: new Date().toISOString(),
      userId: userId
    };

    // Store media item in database
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    await db.collection('media').insertOne({
      _id: new ObjectId(mediaItem.id),
      ...mediaItem
    });

    return NextResponse.json(mediaItem, { status: 201 });
  } catch (error) {
    console.error('Error uploading media:', error);
    return NextResponse.json(
      { error: 'Failed to upload media' },
      { status: 500 }
    );
  }
}

// Increase the max request size to handle larger file uploads
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '50mb',
  },
}; 