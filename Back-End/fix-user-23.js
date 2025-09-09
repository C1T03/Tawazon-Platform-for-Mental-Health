import db from './src/config/db.js';

async function fixUser23() {
  try {
    // التحقق من وجود المستخدم 23 في جدول doctors
    const [doctorCheck] = await db.query('SELECT * FROM doctors WHERE user_id = 23');
    
    if (doctorCheck.length === 0) {
      // إنشاء سجل في جدول doctors للمستخدم 23
      const [result] = await db.query(`
        INSERT INTO doctors (user_id, specialization, title, experience_years, consultation_fee, certificate, languages, date_of_birth) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [23, 'علم النفس', 'أخصائية نفسية', 3, 150, 'شهادة علم نفس', 'العربية', '2002-01-01']);
      
      console.log(`تم إنشاء سجل طبيب للمستخدم 23 بـ Doctor ID: ${result.insertId}`);
    } else {
      console.log('المستخدم 23 له سجل في جدول doctors بالفعل');
    }
    
    // عرض معلومات المستخدم مع doctorId
    const [userInfo] = await db.query(`
      SELECT u.id, u.name, u.role, d.id as doctorId 
      FROM users u 
      LEFT JOIN doctors d ON u.id = d.user_id 
      WHERE u.id = 23
    `);
    
    console.log('معلومات المستخدم 23:', userInfo[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('خطأ:', error);
    process.exit(1);
  }
}

fixUser23();