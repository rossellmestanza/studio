import { NextResponse } from 'next/server';
import { initializeAdminApp, getAdminStorage } from '@/firebase/admin';

// Ensure the admin app is initialized
initializeAdminApp();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string | 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Get the admin storage instance
    const storage = getAdminStorage();
    const bucket = storage.bucket();

    // Create a buffer from the file
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Create a unique filename
    const filename = `${folder}/${Date.now()}_${file.name.replace(/\s/g, '_')}`;

    // Upload the file to Firebase Storage
    const fileUpload = bucket.file(filename);

    await fileUpload.save(fileBuffer, {
      metadata: {
        contentType: file.type,
      },
    });

    // Get the public URL
    const [url] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: '03-09-2491', // A far-future expiration date
    });
    
    // Note: The public URL might look different from client-side URLs.
    // It is often in the format: https://storage.googleapis.com/[BUCKET_NAME]/[FILE_PATH]

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error uploading file:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: 'Failed to upload file', details: errorMessage }, { status: 500 });
  }
}
