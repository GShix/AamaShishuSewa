# Vercel Deployment Issue - 404 Routes Not Found

## Problem
All API routes returning 404 errors:
- `/api/bookings/my-bookings` - 404
- `/api/services` - 404
- `/api/jobs` - 404
- `/api/jobs/my-applications` - 404

## Root Cause
**Vercel is not deploying the latest server code from the repository.**

## Why This Happens
You have a **monorepo structure** with two separate folders:
- `/client` - Frontend (deployed to `aama-shishu-sewa.vercel.app`)
- `/server` - Backend (should deploy to `aamashishu-sewa.vercel.app`)

Vercel may have:
1. Two separate projects configured
2. The server project not properly linked to the `/server` folder
3. Auto-deployment not triggered for server changes

## Solution Steps

### Option 1: Manual Redeploy (Quickest)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your **server project** (`aamashishu-sewa`)
3. Click on **Deployments** tab
4. Click **⋯ (three dots)** on the latest deployment
5. Click **Redeploy**
6. Wait 2-3 minutes

### Option 2: Check Project Settings
1. Go to Vercel → Your server project → **Settings**
2. Go to **General** section
3. Check **Root Directory**: Should be `server` (not empty)
4. Check **Build Command**: Should be blank or `npm install`
5. Check **Output Directory**: Should be blank
6. Click **Save**
7. Go to **Deployments** and redeploy

### Option 3: Reconnect Repository
If the above don't work:
1. In Vercel server project → **Settings** → **Git**
2. Verify it's connected to your GitHub repository
3. Check **Production Branch**: Should be `main`
4. Enable **Auto-deploy**: Should be ON
5. Add a filter to deploy only when `/server` changes (optional)

## Verification After Deployment

Test these URLs in your browser or curl:

```bash
# Health check (should show version 1.0.1 and route list)
https://aamashishu-sewa.vercel.app/

# Services endpoint
https://aamashishu-sewa.vercel.app/api/services

# Jobs endpoint
https://aamashishu-sewa.vercel.app/api/jobs

# Debug endpoint (shows all services)
https://aamashishu-sewa.vercel.app/api/debug/all-services
```

Expected responses:
- **Root**: JSON with `version: "1.0.1"` and routes list
- **Services**: Array of services (or empty array `[]`)
- **Jobs**: `{success: true, jobs: [...]}`

## What We've Done
✅ Created all route files (`bookings.js`, `services.js`, `jobs.js`)
✅ Registered routes in `server.js`
✅ Fixed all `professional_id` → `employee_id` references
✅ Added compatibility for different database schemas
✅ Committed and pushed all changes to GitHub
✅ Added version number to force deployment trigger

## Next Steps
1. **Wait 3-5 minutes** for current deployment to complete
2. **Test the root endpoint** to see if version changed to 1.0.1
3. If still 404, **manually redeploy** from Vercel dashboard
4. Once deployed, run the SQL migrations in Supabase (see MIGRATIONS.md)

## SQL Migrations Required

After routes are deployed, run these in **Supabase SQL Editor**:

```sql
-- 1. Add is_active column to services
ALTER TABLE services ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
UPDATE services SET is_active = true WHERE is_active IS NULL;

-- 2. Ensure jobs have open status
UPDATE jobs SET status = 'open' WHERE status IS NULL OR status = '';

-- 3. Rename professional_id to employee_id in bookings
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'professional_id'
  ) THEN
    ALTER TABLE bookings RENAME COLUMN professional_id TO employee_id;
  END IF;
END $$;
```

## Contact Points
- Client URL: https://aama-shishu-sewa.vercel.app
- Server URL: https://aamashishu-sewa.vercel.app
- GitHub Repo: Main branch
- Last Commit: 0f1e69e (Force server deployment)
