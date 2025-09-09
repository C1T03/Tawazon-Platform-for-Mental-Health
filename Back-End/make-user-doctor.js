import db from './src/config/db.js';

async function makeUserDoctor() {
  try {
    console.log('أدخل email المستخدم الذي تريد تحويله إلى طبيب:');
    
    // للاختبار، سنستخدم أول مستخدم موجود
    const [users] = await db.query('SELECT * FROM users WHERE role != "doctor" LIMIT 1');
    
    if (users.length === 0) {
      console.log('لا يوجد مستخدمون غير أطباء');
      process.exit(0);
    }
    
    const user = users[0];
    console.log(`سيتم تحويل المستخدم: ${user.name} (${user.email}) إلى طبيب`);
    
    // تحديث role المستخدم
    await db.query('UPDATE users SET role = "doctor" WHERE id = ?', [user.id]);
    
    // إنشاء سجل في جدول doctors
    const [doctorResult] = await db.query(`
      INSERT INTO doctors (user_id, specialization, title, experience_years, consultation_fee, certificate, languages, date_of_birth) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [user.id, 'طب نفسي', 'دكتور', 5, 200, 'شهادة طبية', 'العربية', '1990-01-01']);
    
    console.log(`تم تحويل ${user.name} إلى طبيب بنجاح!`);
    console.log(`Doctor ID: ${doctorResult.insertId}`);
    console.log(`يمكنك الآن تسجيل الدخول بـ: ${user.email}`);
    
    process.exit(0);
  } catch (error) {
    console.error('خطأ:', error);
    process.exit(1);
  }
}

makeUserDoctor();