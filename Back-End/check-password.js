import db from './src/config/db.js';

const checkPassword = async () => {
  try {
    const [result] = await db.query('SELECT id, name, email, password FROM users WHERE id = 23');
    if (result.length > 0) {
      console.log('User ID:', result[0].id);
      console.log('Name:', result[0].name);
      console.log('Email:', result[0].email);
      console.log('Password:', result[0].password);
    } else {
      console.log('المستخدم غير موجود');
    }
  } catch (error) {
    console.error('خطأ:', error);
  } finally {
    process.exit(0);
  }
};

checkPassword();