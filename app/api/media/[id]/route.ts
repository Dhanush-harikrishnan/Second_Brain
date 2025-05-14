// Simple placeholder implementation without Cloudinary

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return Response.json(
    { message: 'Media retrieval functionality is disabled' },
    { status: 501 } // 501 Not Implemented
  );
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  return Response.json(
    { message: 'Media deletion functionality is disabled' },
    { status: 501 } // 501 Not Implemented
  );
}