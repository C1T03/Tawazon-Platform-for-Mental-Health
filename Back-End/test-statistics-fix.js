import db from './src/config/db.js';

async function testStatisticsQueries() {
  console.log('Testing statistics queries...\n');

  try {
    // Test 1: Basic user count
    console.log('1. Testing basic user count...');
    const [totalUsersResult] = await db.query('SELECT COUNT(*) as count FROM users');
    console.log('✅ Total users:', totalUsersResult[0]?.count || 0);

    // Test 2: Doctor count
    console.log('\n2. Testing doctor count...');
    const [totalDoctorsResult] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "doctor"');
    console.log('✅ Total doctors:', totalDoctorsResult[0]?.count || 0);

    // Test 3: New users this month (using registration_date)
    console.log('\n3. Testing new users this month...');
    const [newUsersResult] = await db.query(`
      SELECT COUNT(*) as count FROM users 
      WHERE MONTH(registration_date) = MONTH(CURRENT_DATE()) 
      AND YEAR(registration_date) = YEAR(CURRENT_DATE())
    `);
    console.log('✅ New users this month:', newUsersResult[0]?.count || 0);

    // Test 4: Age distribution from users table
    console.log('\n4. Testing age distribution...');
    const [ageDistributionResult] = await db.query(`
      SELECT 
        CASE 
          WHEN age BETWEEN 18 AND 25 THEN '18-25'
          WHEN age BETWEEN 26 AND 35 THEN '26-35'
          WHEN age BETWEEN 36 AND 45 THEN '36-45'
          WHEN age BETWEEN 46 AND 55 THEN '46-55'
          WHEN age > 55 THEN '55+'
          ELSE 'غير محدد'
        END as ageGroup,
        COUNT(*) as count
      FROM users 
      WHERE age IS NOT NULL
      GROUP BY ageGroup
    `);
    console.log('✅ Age distribution:', ageDistributionResult);

    // Test 5: Doctor specialization distribution
    console.log('\n5. Testing doctor specialization distribution...');
    const [doctorSpecializationResult] = await db.query(`
      SELECT d.specialization, COUNT(*) as count 
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE d.specialization IS NOT NULL AND d.specialization != '' 
      GROUP BY d.specialization 
      ORDER BY count DESC
    `);
    console.log('✅ Doctor specializations:', doctorSpecializationResult);

    // Test 6: Doctor posts count
    console.log('\n6. Testing doctor posts count...');
    const [totalPostsResult] = await db.query('SELECT COUNT(*) as count FROM doctor_posts');
    console.log('✅ Total doctor posts:', totalPostsResult[0]?.count || 0);

    // Test 7: Doctor appointments count
    console.log('\n7. Testing doctor appointments count...');
    const [totalAppointmentsResult] = await db.query('SELECT COUNT(*) as count FROM doctor_appointments');
    console.log('✅ Total appointments:', totalAppointmentsResult[0]?.count || 0);

    console.log('\n🎉 All tests passed! The statistics controller should work correctly now.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('SQL:', error.sql);
  } finally {
    await db.end();
  }
}

testStatisticsQueries();