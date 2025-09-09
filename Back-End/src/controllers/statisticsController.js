import db from '../config/db.js';

export const getStatistics = async (req, res) => {
  try {
    // إحصائيات المستخدمين
    const [totalUsersResult] = await db.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = totalUsersResult[0]?.count || 0;

    // إحصائيات الأطباء
    const [totalDoctorsResult] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "doctor"');
    const totalDoctors = totalDoctorsResult[0]?.count || 0;

    // إحصائيات المرضى
    const [totalPatientsResult] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "user"');
    const totalPatients = totalPatientsResult[0]?.count || 0;

    // إحصائيات المنشورات (من جدول doctor_posts)
    let totalPosts = 0;
    try {
      const [totalPostsResult] = await db.query('SELECT COUNT(*) as count FROM doctor_posts');
      totalPosts = totalPostsResult[0]?.count || 0;
    } catch (error) {
      console.log('Doctor posts table not found, using default value');
    }

    // إحصائيات المواعيد
    let totalAppointments = 0;
    try {
      const [totalAppointmentsResult] = await db.query('SELECT COUNT(*) as count FROM appointments');
      totalAppointments = totalAppointmentsResult[0]?.count || 0;
    } catch (error) {
      console.log('Appointments table not found, using default value');
    }

    // المستخدمين الجدد هذا الشهر
    const [newUsersResult] = await db.query(`
      SELECT COUNT(*) as count FROM users 
      WHERE MONTH(registration_date) = MONTH(CURRENT_DATE()) 
      AND YEAR(registration_date) = YEAR(CURRENT_DATE())
    `);
    const newUsersThisMonth = newUsersResult[0]?.count || 0;

    // توزيع الأعمار (من جدول users باستخدام العمر المحفوظ)
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
      ORDER BY 
        CASE ageGroup
          WHEN '18-25' THEN 1
          WHEN '26-35' THEN 2
          WHEN '36-45' THEN 3
          WHEN '46-55' THEN 4
          WHEN '55+' THEN 5
          ELSE 6
        END
    `);

    // إضافة توزيع أعمار الأطباء من جدول doctors
    let doctorAgeDistribution = [];
    try {
      const [doctorAgeResult] = await db.query(`
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
        ORDER BY 
          CASE ageGroup
            WHEN '25-35' THEN 1
            WHEN '36-45' THEN 2
            WHEN '46-55' THEN 3
            WHEN '55+' THEN 4
            ELSE 5
          END
      `);
      doctorAgeDistribution = doctorAgeResult;
    } catch (error) {
      console.log('Error getting doctor age distribution:', error.message);
    }

    // توزيع المدن - ديناميكي بناءً على البيانات الفعلية
    const [cityDistributionResult] = await db.query(`
      SELECT city, COUNT(*) as count 
      FROM users 
      WHERE city IS NOT NULL AND city != '' 
      GROUP BY city 
      ORDER BY count DESC
    `);

    // توزيع الجنس
    const [genderDistributionResult] = await db.query(`
      SELECT 
        CASE 
          WHEN gender = 'male' THEN 'ذكر'
          WHEN gender = 'female' THEN 'أنثى'
          ELSE 'غير محدد'
        END as gender,
        COUNT(*) as count
      FROM users 
      WHERE gender IS NOT NULL
      GROUP BY gender
    `);

    // تنسيق البيانات
    const statistics = {
      overview: {
        totalUsers,
        totalDoctors,
        totalPosts,
        totalPatients,
        totalAppointments,
        newUsersThisMonth
      },
      ageDistribution: ageDistributionResult.map(row => ({
        ageGroup: row.ageGroup,
        count: row.count
      })),
      doctorAgeDistribution: doctorAgeDistribution.map(row => ({
        ageGroup: row.ageGroup,
        count: row.count
      })),
      cityDistribution: cityDistributionResult.map(row => ({
        city: row.city,
        count: row.count
      })),
      genderDistribution: genderDistributionResult.map(row => ({
        gender: row.gender,
        count: row.count
      }))
    };

    res.json({
      success: true,
      data: statistics
    });

  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الإحصائيات',
      error: error.message
    });
  }
};

// إحصائيات الأطباء المتقدمة
export const getDoctorStatistics = async (req, res) => {
  try {
    // توزيع الأطباء حسب المدن
    const [doctorCityDistribution] = await db.query(`
      SELECT u.city, COUNT(*) as count 
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE u.city IS NOT NULL AND u.city != '' 
      GROUP BY u.city 
      ORDER BY count DESC
    `);

    // توزيع الأطباء حسب التخصص
    const [doctorSpecializationDistribution] = await db.query(`
      SELECT d.specialization, COUNT(*) as count 
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE d.specialization IS NOT NULL AND d.specialization != '' 
      GROUP BY d.specialization 
      ORDER BY count DESC
    `);

    // توزيع الأطباء حسب سنوات الخبرة
    const [doctorExperienceDistribution] = await db.query(`
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
      ORDER BY 
        CASE experienceGroup
          WHEN '0-2 سنوات' THEN 1
          WHEN '3-5 سنوات' THEN 2
          WHEN '6-10 سنوات' THEN 3
          WHEN 'أكثر من 10 سنوات' THEN 4
          ELSE 5
        END
    `);

    const doctorStats = {
      cityDistribution: doctorCityDistribution.map(row => ({
        city: row.city,
        count: row.count
      })),
      specializationDistribution: doctorSpecializationDistribution.map(row => ({
        specialization: row.specialization,
        count: row.count
      })),
      experienceDistribution: doctorExperienceDistribution.map(row => ({
        experienceGroup: row.experienceGroup,
        count: row.count
      }))
    };

    res.json({
      success: true,
      data: doctorStats
    });

  } catch (error) {
    console.error('Doctor statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب إحصائيات الأطباء',
      error: error.message
    });
  }
};

// إحصائيات المرضى المتقدمة
export const getPatientStatistics = async (req, res) => {
  try {
    // توزيع المرضى حسب المدن
    const [patientCityDistribution] = await db.query(`
      SELECT city, COUNT(*) as count 
      FROM users 
      WHERE role = 'user' AND city IS NOT NULL AND city != '' 
      GROUP BY city 
      ORDER BY count DESC
    `);

    // إحصائيات المواعيد (باستخدام جدول appointments)
    let appointmentStats = [];
    try {
      const [appointmentStatsResult] = await db.query(`
        SELECT 
          DATE_FORMAT(created_at, '%Y-%m') as month,
          COUNT(*) as count
        FROM appointments 
        WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
        GROUP BY month
        ORDER BY month DESC
      `);
      appointmentStats = appointmentStatsResult;
    } catch (error) {
      console.log('Error getting appointment statistics:', error.message);
    }

    const patientStats = {
      cityDistribution: patientCityDistribution.map(row => ({
        city: row.city,
        count: row.count
      })),
      appointmentStats: appointmentStats.map(row => ({
        month: row.month,
        count: row.count
      }))
    };

    res.json({
      success: true,
      data: patientStats
    });

  } catch (error) {
    console.error('Patient statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب إحصائيات المرضى',
      error: error.message
    });
  }
};