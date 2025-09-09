# Statistics Controller Fixes

## Issues Fixed

### 1. Column Name Mismatches
- **Problem**: The controller was trying to access `created_at` column in `users` table, but the actual column name is `registration_date`
- **Fix**: Updated all queries to use `registration_date` instead of `created_at`

### 2. Missing Columns in Users Table
- **Problem**: The controller was trying to access `specialization` and `experience_years` from `users` table, but these columns exist in the `doctors` table
- **Fix**: Updated queries to join `doctors` and `users` tables properly:
  ```sql
  SELECT d.specialization, COUNT(*) as count 
  FROM doctors d
  JOIN users u ON d.user_id = u.id
  WHERE d.specialization IS NOT NULL AND d.specialization != '' 
  GROUP BY d.specialization 
  ORDER BY count DESC
  ```

### 3. Age Distribution Logic
- **Problem**: The controller was trying to calculate age from `date_of_birth` in `users` table, but this column exists in `doctors` table
- **Fix**: 
  - Used the `age` column from `users` table for general user age distribution
  - Added separate doctor age distribution using `date_of_birth` from `doctors` table

### 4. Table Name Updates
- **Problem**: The controller was looking for `posts` and `sessions` tables that don't exist
- **Fix**: 
  - Updated to use `doctor_posts` table for posts statistics
  - Updated to use `doctor_appointments` table for appointment statistics instead of sessions

## Updated Queries

### New Users This Month
```sql
SELECT COUNT(*) as count FROM users 
WHERE MONTH(registration_date) = MONTH(CURRENT_DATE()) 
AND YEAR(registration_date) = YEAR(CURRENT_DATE())
```

### Doctor Specialization Distribution
```sql
SELECT d.specialization, COUNT(*) as count 
FROM doctors d
JOIN users u ON d.user_id = u.id
WHERE d.specialization IS NOT NULL AND d.specialization != '' 
GROUP BY d.specialization 
ORDER BY count DESC
```

### Doctor Experience Distribution
```sql
SELECT 
  CASE 
    WHEN d.experience_years BETWEEN 0 AND 2 THEN '0-2 سنوات'
    WHEN d.experience_years BETWEEN 3 AND 5 THEN '3-5 سنوات'
    WHEN d.experience_years BETWEEN 6 AND 10 THEN '6-10 سنوات'
    WHEN d.experience_years > 10 THEN 'أكثر من 10 سنوات'
    ELSE 'غير محدد'
  END as experienceGroup,
  COUNT(*) as count
FROM doctors d
JOIN users u ON d.user_id = u.id
GROUP BY experienceGroup
```

### Doctor Age Distribution
```sql
SELECT 
  CASE 
    WHEN TIMESTAMPDIFF(YEAR, d.date_of_birth, CURDATE()) BETWEEN 25 AND 35 THEN '25-35'
    WHEN TIMESTAMPDIFF(YEAR, d.date_of_birth, CURDATE()) BETWEEN 36 AND 45 THEN '36-45'
    WHEN TIMESTAMPDIFF(YEAR, d.date_of_birth, CURDATE()) BETWEEN 46 AND 55 THEN '46-55'
    WHEN TIMESTAMPDIFF(YEAR, d.date_of_birth, CURDATE()) > 55 THEN '55+'
    ELSE 'غير محدد'
  END as ageGroup,
  COUNT(*) as count
FROM doctors d
JOIN users u ON d.user_id = u.id
WHERE d.date_of_birth IS NOT NULL
GROUP BY ageGroup
```

## Test Results
All queries now work correctly:
- ✅ Total users: 15
- ✅ Total doctors: 7
- ✅ New users this month: 3
- ✅ Age distribution working
- ✅ Doctor specializations: طبيب نفسي (3), أخصائي نفسي (3)
- ✅ Total doctor posts: 7
- ✅ Total appointments: 1

## Files Modified
- `src/controllers/statisticsController.js` - Fixed all SQL queries to match database schema
- `test-statistics-fix.js` - Created test script to verify fixes

The statistics controller should now work without any database errors.