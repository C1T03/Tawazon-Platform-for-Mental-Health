import db from './src/config/db.js';

const checkUser23 = async () => {
  try {
    console.log('فحص بيانات المستخدم رقم 23...\n');

    // فحص بيانات المستخدم
    const [userResult] = await db.query('SELECT * FROM users WHERE id = 23');
    if (userResult.length > 0) {
      console.log('=== بيانات المستخدم ===');
      console.log('ID:', userResult[0].id);
      console.log('Name:', userResult[0].name);
      console.log('Email:', userResult[0].email);
      console.log('Role:', userResult[0].role);
      console.log('');
    } else {
      console.log('❌ المستخدم رقم 23 غير موجود');
      return;
    }

    // فحص بيانات الطبيب
    const [doctorResult] = await db.query('SELECT * FROM doctors WHERE user_id = 23');
    if (doctorResult.length > 0) {
      console.log('=== بيانات الطبيب ===');
      console.log('Doctor ID:', doctorResult[0].id);
      console.log('User ID:', doctorResult[0].user_id);
      console.log('Title:', doctorResult[0].title);
      console.log('Specialization:', doctorResult[0].specialization);
      console.log('');
    } else {
      console.log('❌ لا يوجد سجل طبيب للمستخدم رقم 23');
      
      // إنشاء سجل طبيب
      console.log('إنشاء سجل طبيب للمستخدم رقم 23...');
      const [insertResult] = await db.query(`
        INSERT INTO doctors (
          user_id, 
          title, 
          specialization, 
          experience_years, 
          languages, 
          consultation_fee,
          date_of_birth,
          certificate
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        23,
        'دكتور',
        'أخصائي نفسي',
        0,
        'العربية',
        0,
        '1990-01-01',
        'شهادة في الطب النفسي'
      ]);
      
      console.log('✅ تم إنشاء سجل طبيب بنجاح! Doctor ID:', insertResult.insertId);
    }

    // اختبار الاستعلام المستخدم في تسجيل الدخول
    console.log('=== اختبار استعلام تسجيل الدخول ===');
    const [loginResult] = await db.query(`
      SELECT u.id, u.name, u.email, u.role, u.gender, u.country, u.age, u.phone, u.city, u.address, u.bio, u.profile_picture, u.password, u.last_login, u.registration_date, d.id as doctorId 
      FROM users u 
      LEFT JOIN doctors d ON u.id = d.user_id 
      WHERE u.id = 23
    `);
    
    if (loginResult.length > 0) {
      const user = loginResult[0];
      console.log('User ID:', user.id);
      console.log('Name:', user.name);
      console.log('Role:', user.role);
      console.log('Doctor ID:', user.doctorId);
      console.log('Doctor ID Type:', typeof user.doctorId);
      console.log('Doctor ID is null?', user.doctorId === null);
      console.log('Doctor ID is undefined?', user.doctorId === undefined);
    }

  } catch (error) {
    console.error('خطأ:', error);
  } finally {
    process.exit(0);
  }
};

checkUser23();