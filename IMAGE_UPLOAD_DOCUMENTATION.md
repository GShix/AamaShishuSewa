# Image Upload Feature for Admin Posts

## Overview
Admins can now upload images directly when creating or editing posts in the admin dashboard, in addition to using image URLs.

## Features Implemented

### Backend (Server)
1. **Multer Middleware** (`server/src/middleware/upload.js`)
   - Handles multipart/form-data file uploads
   - Validates file types (JPEG, PNG, GIF, WebP)
   - Limits file size to 5MB
   - Generates unique filenames to prevent conflicts
   - Stores images in `server/uploads/posts/`

2. **Upload Endpoint** (`/api/admin/upload/post-image`)
   - POST route for image uploads
   - Requires admin authentication
   - Returns the uploaded image URL

3. **Static File Serving**
   - Configured Express to serve files from `/uploads` directory
   - Images accessible at: `http://localhost:6000/uploads/posts/filename.jpg`

### Frontend (Client)
1. **PostsManagement Component** (`client/src/components/admin/PostsManagement.jsx`)
   - File upload input with drag-and-drop style interface
   - Real-time image preview
   - Upload progress indication
   - Option to use either file upload OR URL
   - Image removal functionality

2. **API Integration** (`client/src/utils/api.js`)
   - Added `uploadPostImage()` function
   - Handles FormData with multipart/form-data headers

## Usage

### Creating a Post with Image Upload
1. Go to Admin Dashboard → Posts & Notices
2. Click "Create Post" button
3. Fill in post details (title, content, category, etc.)
4. For the image:
   - **Option 1**: Click "Choose Image File" to select a file from your computer, then click "Upload"
   - **Option 2**: Paste an image URL in the text field
5. Preview the image before submitting
6. Click "Create Post" to publish

### Image Guidelines
- **Supported formats**: JPEG, JPG, PNG, GIF, WebP
- **Maximum file size**: 5MB
- **Recommended dimensions**: 1200x630px for best display

## API Endpoints

### Upload Post Image
```
POST /api/admin/upload/post-image
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Body:
- image: File (required)

Response:
{
  "message": "Image uploaded successfully",
  "imageUrl": "/uploads/posts/filename-123456789.jpg",
  "fileName": "filename-123456789.jpg"
}
```

## File Storage Structure
```
server/
  uploads/
    posts/
      .gitkeep
      image-1234567890.jpg
      notice-9876543210.png
      ...
```

## Security Features
- File type validation (only images allowed)
- File size limits (5MB max)
- Unique filename generation to prevent overwrites
- Admin authentication required for uploads
- Sanitized file paths

## Development Notes
- Uploads are stored locally in development
- For production, consider using cloud storage (AWS S3, Cloudinary, etc.)
- The uploads/ directory is gitignored but the structure is preserved with .gitkeep
- Images are served as static files through Express

## Future Enhancements
- Image optimization/compression
- Cloud storage integration (S3, Cloudinary)
- Image cropping/editing tools
- Multiple image uploads per post
- Image gallery management
