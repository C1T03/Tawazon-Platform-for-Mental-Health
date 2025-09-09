import db from './src/config/db.js';

const testStatistics = async () => {
  try {
    console.log('Testing statistics queries...');
    
    // Test basic user count
    console.log('\n1. Testing total users count...');
    const [totalUsersResult] = await db.query('SELECT COUNT(*) as count FROM users');
    console.log('✅ Total users:', totalUsersResult[0]?.count || 0);
    
    // Test doctors count
    console.log('\n2. Testing doctors count...');
    const [totalDoctorsResult] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "doctor"');
    console.log('✅ Total doctors:', totalDoctorsResult[0]?.count || 0);
    
    // Test patients count
    console.log('\n3. Testing patients count...');
    const [totalPatientsResult] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "user"');
    console.log('✅ Total patients:', totalPatientsResult[0]?.count || 0);
    
    // Test age distribution query
    console.log('\n4. Testing age distribution...');
    const [ageDistributionResult] = await db.query(`
      SELECT 
        CASE 
          WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 18 AND 25 THEN '18-25'
          WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 26 AND 35 THEN '26-35'
          WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 36 AND 45 THEN '36-45'
          WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 46 AND 55 THEN '46-55'
          WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) > 55 THEN '55+'
          ELSE 'غير محدد'
        END as ageGroup,
        COUNT(*) as count
      FROM users 
      WHERE date_of_birth IS NOT NULL
      GROUP BY ageGroup
    `);
    console.log('✅ Age distribution:', ageDistributionResult);
    
    // Test city distribution
    console.log('\n5. Testing city distribution...');
    const [cityDistributionResult] = await db.query(`
      SELECT city, COUNT(*) as count 
      FROM users 
      WHERE city IS NOT NULL AND city != '' 
      GROUP BY city 
      ORDER BY count DESC
      LIMIT 5
    `);
    console.log('✅ City distribution (top 5):', cityDistributionResult);
    
    console.log('\n✅ All statistics queries completed successfully!');
    
  } catch (error) {
    console.error('❌ Statistics test failed:');
    console.error('Error:', error.message);
    console.error('SQL State:', error.sqlState);
    console.error('SQL Message:', error.sqlMessage);
  }
};

testStatistics();