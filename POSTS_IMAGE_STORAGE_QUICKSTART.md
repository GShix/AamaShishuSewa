# Quick Start: Database Image Storage for Posts

## ✅ Implementation Complete!

Your posts system now stores images **directly in the Supabase database** instead of on the filesystem.

## 🚀 How to Use

### Step 1: Run the Database Migration

Go to your **Supabase Dashboard**:
1. Visit: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the sidebar
4. Copy and paste this migration:

```sql
-- Migration: Update posts table to store images in database
-- Description: Drop and recreate posts table with BYTEA for image storage

-- Drop existing table and related objects
DROP TRIGGER IF EXISTS posts_published_at_trigger ON posts;
DROP TRIGGER IF EXISTS posts_updated_at_trigger ON posts;
DROP FUNCTION IF EXISTS set_posts_published_at();
DROP FUNCTION IF EXISTS update_posts_updated_at();
DROP TABLE IF EXISTS posts CASCADE;

-- Recreate posts table with image storage
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category VARCHAR(50) NOT NULL DEFAULT 'news' CHECK (category IN ('news', 'update', 'announcement', 'event', 'notice', 'alert')),
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('normal', 'high', 'urgent')),
  tags JSONB DEFAULT '[]'::jsonb,
  image_data BYTEA,
  image_type VARCHAR(50),
  image_url TEXT,
  published BOOLEAN DEFAULT true,
  author_id UUID,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_priority ON posts(priority);
CREATE INDEX idx_posts_published ON posts(published);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_tags ON posts USING gin(tags);

-- Add triggers
CREATE OR REPLACE FUNCTION update_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  IF NEW.published = true AND OLD.published = false THEN
    NEW.published_at = CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at_trigger
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_posts_updated_at();

CREATE OR REPLACE FUNCTION set_posts_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.published = true AND NEW.published_at IS NULL THEN
    NEW.published_at = CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_published_at_trigger
BEFORE INSERT ON posts
FOR EACH ROW
EXECUTE FUNCTION set_posts_published_at();
```

5. Click **RUN** or press `Ctrl+Enter`
6. Wait for success message

### Step 2: Restart Your Server

```bash
cd server
npm run dev
```

### Step 3: Test the Feature

1. Open your admin dashboard: http://localhost:5173/admin
2. Log in as admin
3. Navigate to **Posts & Notices**
4. Click **Create Post**
5. Fill in the details
6. Upload an image:
   - Click "Choose Image File"
   - Select an image (< 5MB, JPEG/PNG/GIF/WebP)
   - Click "Upload"
   - See preview
7. Click "Create Post"
8. ✅ Image is now stored in the database!

## 🎯 What Works Now

### ✅ Image Upload
- Select image file from computer
- Upload converts to base64
- Preview shows immediately
- Stored in database when post is created

### ✅ Image Display
- Posts grid shows images from database
- Images served via `/api/posts/{id}/image`
- Cached for performance
- Fallback to external URLs still works

### ✅ Image Management
- Remove uploaded images
- Replace with new images
- Edit posts keep their images
- Delete posts removes images automatically

## 📊 Database Storage

**How Images are Stored:**
- `image_data` → Binary image data (BYTEA)
- `image_type` → MIME type (image/jpeg, image/png, etc.)
- `image_url` → Optional external URL (backward compatible)

**How Images are Retrieved:**
```
GET /api/posts/{post-id}/image
Returns: Binary image with correct Content-Type header
```

## 🔍 Verification

Check if migration worked:

1. **In Supabase Dashboard:**
   - Go to Table Editor
   - Open `posts` table
   - Verify columns: `image_data`, `image_type`, `image_url`

2. **Test Upload:**
   - Create a post with image
   - Check in Supabase Table Editor
   - `image_data` should show `<binary>` or size
   - `image_type` should show `image/jpeg` (or similar)

3. **Test Display:**
   - View post in posts grid
   - Image should display correctly
   - Open browser DevTools → Network
   - Should see request to `/api/posts/{id}/image`

## ⚠️ Important Notes

### File Size Limits
- **Maximum:** 5MB per image
- **Recommended:** < 1MB for best performance
- Compress large images before upload

### Supported Formats
- JPEG (.jpg, .jpeg) ✅
- PNG (.png) ✅
- GIF (.gif) ✅
- WebP (.webp) ✅

### Performance
- Images cached for 1 year
- Use compressed images
- Consider 1200px max width
- Database size increases with images

## 🐛 Troubleshooting

**Problem:** Migration fails
- **Solution:** Make sure you're in the correct project
- **Solution:** Check if posts table exists first

**Problem:** Images don't upload
- **Solution:** Check file size < 5MB
- **Solution:** Verify file format is supported
- **Solution:** Check browser console for errors

**Problem:** Images don't display
- **Solution:** Check server is running
- **Solution:** Verify API URL in `.env` file
- **Solution:** Check browser Network tab

**Problem:** "Failed to create post"
- **Solution:** Check all required fields filled
- **Solution:** Verify admin token is valid
- **Solution:** Check server console logs

## 📝 Summary

✅ **Database schema updated** with BYTEA columns
✅ **Upload endpoint** returns base64 data  
✅ **Image serving endpoint** at `/api/posts/{id}/image`
✅ **Frontend updated** to handle database images
✅ **Backward compatible** with external URLs

**Migration:** Run SQL in Supabase Dashboard
**Status:** Ready to use!
**Location:** Admin Dashboard → Posts & Notices

## 📚 More Information

- **Full Guide:** `DATABASE_IMAGE_STORAGE_GUIDE.md`
- **Migration File:** `server/scripts/migrations/007_update_posts_table_with_image_storage.sql`
- **Original Docs:** `IMAGE_UPLOAD_DOCUMENTATION.md`

---

**Ready to go!** Run the migration and start uploading images. 🎉
