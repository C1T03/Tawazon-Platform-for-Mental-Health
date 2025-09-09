import db from './src/config/db.js';

const fixMissingDoctors = async () => {
  try {
    console.log('بدء إصلاح المستخدمين الذين لديهم دور doctor ولكن لا يوجد لهم سجل في جدول doctors...');

    // البحث عن المستخدمين الذين لديهم دور doctor ولكن لا يوجد لهم سجل في جدول doctors
    const [usersWithoutDoctorRecord] = await db.query(`
      SELECT u.id, u.name, u.email, u.bio
      FROM users u
      LEFT JOIN doctors d ON u.id = d.user_id
      WHERE u.role = 'doctor' AND d.id IS NULL
    `);

    if (usersWithoutDoctorRecord.length === 0) {
      console.log('لا توجد مستخدمين بحاجة لإصلاح.');
      return;
    }

    console.log(`تم العثور على ${usersWithoutDoctorRecord.length} مستخدم بحاجة لإصلاح:`);
    usersWithoutDoctorRecord.forEach(user => {
      console.log(`- ${user.name} (ID: ${user.id}, Email: ${user.email})`);
    });

    // إنشاء سجلات الأطباء المفقودة
    for (const user of usersWithoutDoctorRecord) {
      try {
        const [result] = await db.query(`
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
          user.id,
          'دكتور',
          'أخصائي نفسي',
          0,
          'العربية',
          0,
          '1990-01-01',
          'شهادة في الطب النفسي'
        ]);

        console.log(`✅ تم إنشاء سجل طبيب للمستخدم ${user.name} (Doctor ID: ${result.insertId})`);
      } catch (error) {
        console.error(`❌ خطأ في إنشاء سجل طبيب للمستخدم ${user.name}:`, error.message);
      }
    }

    // التحقق من النتائج
    const [updatedCheck] = await db.query(`
      SELECT u.id, u.name, d.id as doctor_id
      FROM users u
      LEFT JOIN doctors d ON u.id = d.user_id
      WHERE u.role = 'doctor'
    `);

    console.log('\n=== النتائج النهائية ===');
    updatedCheck.forEach(user => {
      const status = user.doctor_id ? '✅ يوجد سجل طبيب' : '❌ لا يوجد سجل طبيب';
      console.log(`${user.name} (User ID: ${user.id}, Doctor ID: ${user.doctor_id || 'غير موجود'}) - ${status}`);
    });

    console.log('\n🎉 تم الانتهاء من عملية الإصلاح!');

  } catch (error) {
    console.error('خطأ في عملية الإصلاح:', error);
  } finally {
    process.exit(0);
  }
};

fixMissingDoctors();