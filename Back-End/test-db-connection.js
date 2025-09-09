import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('Testing database connection...');
    console.log('Host:', process.env.DB_HOST || 'localhost');
    console.log('User:', process.env.DB_USER || 'root');
    console.log('Database:', process.env.DB_NAME || 'balance');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '1234',
      database: process.env.DB_NAME || 'balance'
    });

    console.log('✅ Database connection successful!');
    
    // Test if users table exists
    const [tables] = await connection.query("SHOW TABLES LIKE 'users'");
    if (tables.length > 0) {
      console.log('✅ Users table exists');
      
      // Test basic query
      const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
      console.log(`✅ Found ${users[0].count} users in database`);
    } else {
      console.log('❌ Users table does not exist');
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Solution: Start your MySQL server (XAMPP, WAMP, or standalone MySQL)');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Solution: Create the database "balance" in your MySQL server');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Solution: Check your database credentials in .env file');
    }
  }
};

testConnection();