# Migration Instructions

## Problem
The bookings table needs to be recreated with the new schema to support service bookings.

## Error You're Seeing
- "Service not found" or 404 errors when trying to create bookings
- Booking creation fails in the dashboard

## Solution
You need to run the migration SQL in your Supabase database.

### Steps:

1. **Open Supabase Dashboard**
   - Go to https://supabase.com
   - Sign in to your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and Paste the Migration**
   - Open the file: `server/scripts/migrations/003_create_bookings_table.sql`
   - Copy ALL the content
   - Paste it into the SQL Editor

4. **Run the Migration**
   - Click "Run" button (or press Ctrl/Cmd + Enter)
   - Wait for the query to complete

5. **Verify**
   - Go to "Table Editor" in Supabase
   - You should see the `bookings` table with these columns:
     - id
     - user_id
     - service_id
     - service_type
     - booking_date
     - duration_days
     - client_address
     - client_phone
     - special_requirements
     - status
     - employee_id
     - total_price
     - payment_status
     - created_at
     - updated_at

6. **Test**
   - Go back to your dashboard (http://localhost:5173/dashboard)
   - Try to book a service
   - It should work now!

## What This Migration Does
- Drops the old bookings table (if it exists)
- Creates a new bookings table with the correct schema for service bookings
- Adds indexes for better performance
- Sets up Row Level Security (RLS) policies
- Allows users to create and view their own bookings

## Notes
- This will DELETE all existing bookings data
- Make sure you have a backup if you need the old data
- The migration uses CASCADE so it will also drop any dependent objects
