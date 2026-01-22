# Migration: Professional to Employee Rename

## Date: January 21, 2026

## Summary
Renamed all references from "professional" to "employee" throughout the codebase to maintain consistency with the actual business terminology.

## Files Changed

### 1. **Model Files**
- **Renamed:** `src/modal/professionalModel.js` → `src/modal/employeeModel.js`
  - Updated schema name: `professionalSchema` → `employeeSchema`
  - Updated table name: `professionals` → `employees`
  - Updated all field descriptions to use "employee" instead of "professional"

- **Modified:** `src/modal/userModel.js`
  - Updated role enum: `['user', 'professional']` → `['user', 'employee']`

- **Modified:** `src/modal/bookingModel.js`
  - Renamed field: `professional_id` → `employee_id`
  - Updated foreign key: `professionals(id)` → `employees(id)`
  - Updated description: "assigned professional" → "assigned employee"

### 2. **Controller Files**
- **Renamed:** `src/controllers/admin/professionalController.js` → `src/controllers/admin/employeeController.js`
  - Updated all function names:
    - `getAllProfessionals` → `getAllEmployees`
    - `createProfessional` → `createEmployee`
    - `updateProfessional` → `updateEmployee`
    - `deleteProfessional` → `deleteEmployee`
  - Updated all database queries to use `employees` table
  - Updated all variable names (professionals → employees)
  - Updated all error messages and success messages
  - Updated all route comments to use /employees instead of /professionals

- **Modified:** `src/controllers/admin/bookingController.js`
  - Updated join query: `professionals!bookings_professional_id_fkey` → `employees!bookings_employee_id_fkey`

### 3. **Route Files**
- **Modified:** `src/routes/admin/admin.js`
  - Updated import from `professionalController` to `employeeController`
  - Updated all function imports to use employee naming
  - Updated all route paths: `/professionals` → `/employees`
  - Updated route section comment: "PROFESSIONAL MANAGEMENT" → "EMPLOYEE MANAGEMENT"

### 4. **Migration Scripts**
- **Modified:** `scripts/migrations/002_create_users_table.sql`
  - Updated constraint: `role IN ('user', 'professional')` → `role IN ('user', 'employee')`
  - Updated comment: "User role: user or professional" → "User role: user or employee"

- **Created:** `scripts/migrations/003_rename_professionals_to_employees.sql`
  - Renames `professionals` table to `employees`
  - Renames `professional_id` column to `employee_id` in bookings table
  - Updates foreign key constraint name
  - Renames all indexes
  - Updates all table and column comments
  - Updates RLS policy names
  - Includes conditional logic to handle missing objects

## API Endpoint Changes

### Before:
- `GET /api/admin/professionals`
- `POST /api/admin/professionals`
- `PUT /api/admin/professionals/:id`
- `DELETE /api/admin/professionals/:id`

### After:
- `GET /api/admin/employees`
- `POST /api/admin/employees`
- `PUT /api/admin/employees/:id`
- `DELETE /api/admin/employees/:id`

## Database Changes Required

### Migration Steps:
1. **Run migration 003_rename_professionals_to_employees.sql** in Supabase SQL Editor
   - This will rename the `professionals` table to `employees`
   - Update foreign keys in the `bookings` table
   - Rename all indexes and constraints
   - Update RLS policies

2. **Verify the changes:**
   ```sql
   -- Check if table exists
   SELECT * FROM public.employees LIMIT 1;
   
   -- Check foreign key in bookings
   SELECT employee_id FROM public.bookings LIMIT 1;
   
   -- Check indexes
   SELECT indexname FROM pg_indexes WHERE tablename = 'employees';
   ```

## Response Object Changes

### Before:
```json
{
  "professionals": [...],
  "professional": {...}
}
```

### After:
```json
{
  "employees": [...],
  "employee": {...}
}
```

## Testing Checklist

- [ ] Run migration script 003_rename_professionals_to_employees.sql
- [ ] Test GET /api/admin/employees
- [ ] Test POST /api/admin/employees
- [ ] Test PUT /api/admin/employees/:id
- [ ] Test DELETE /api/admin/employees/:id
- [ ] Test GET /api/admin/bookings (verify employee data is included)
- [ ] Verify server starts without errors
- [ ] Check that all employee-related queries work correctly

## Notes

- The Supabase table screenshot shows the actual table structure is for employees/professionals, confirming this rename was needed
- All model documentation has been updated to reflect the new naming
- Foreign key relationships in bookings table are automatically handled by the migration script
- RLS policies have been updated with new names

## Files Not Changed (External Dependencies)

The following files contain references to professional_id but are outside the admin module:
- `src/services/matchingService.js`
- `src/config/supabase.js`
- `src/controllers/user/bookingController.js`

**Action Required:** These files will need to be updated separately to use `employee_id` instead of `professional_id` after running the migration script.
