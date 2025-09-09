import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import { generateTempPassword } from '../utils/helpers.js';

// تعيين الحقول الإلزامية والافتراضية
const REQUIRED_FIELDS = [
  'name', 'gender', 'date_of_birth', 'certificate', 'title',
  'specialization', 'bio', 'experience_years', 'languages',
  'consultation_fee', 'available_days', 'country', 'city',
  'email', 'phone'
];

const DEFAULT_VALUES = {
  profile_image: 'default_profile.jpg',
  sub_specialization: '',
  working_hours: '',
  emergency_available: 0,
  address: '',
  online_consultation: 1,
  website: '',
  social_media_links: null,
  awards: '',
  research_interests: '',
  professional_memberships: '',
  verified: 0,
  rating: 0.0,
  reviews_count: 0,
  patients_count: 0,
  publications_count: 0
};

// Middleware للتحقق من الصلاحيات
const checkAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'غير مصرح لك بهذا الإجراء'
    });
  }
  next();
};

export const getDoctors = async (req, res) => {
  try {
    let { page = 1, limit = 10, specialization, search, city, excludeUserId } = req.query;
    
    // التحقق من صحة المدخلات الرقمية
    page = parseInt(page);
    limit = parseInt(limit);
    
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1 || limit > 100) limit = 10;
    
    const offset = (page - 1) * limit;
    
    let query = 'SELECT d.id, u.name, d.specialization, u.city, u.country, d.certificate, d.languages, d.experience_years, u.gender, d.rating, u.profile_picture, d.consultation_fee, u.email, u.phone, d.title, d.verified, u.bio, COALESCE(u.age, TIMESTAMPDIFF(YEAR, d.date_of_birth, CURDATE())) as age FROM doctors d LEFT JOIN users u ON d.user_id = u.id';
    const params = [];
    const conditions = [];
    
    // استبعاد الطبيب نفسه من القائمة
    if (excludeUserId) {
      conditions.push('u.id != ?');
      params.push(excludeUserId);
    }
    
    if (specialization) {
      conditions.push('d.specialization = ?');
      params.push(specialization);
    }
    
    if (search) {
      conditions.push('u.name LIKE ?');
      params.push(`%${search}%`);
    }

    if (city) {
      conditions.push('u.city = ?');
      params.push(city);
    }
    
    if (conditions.length) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    // جلب العدد الكلي للأطباء
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM doctors d LEFT JOIN users u ON d.user_id = u.id ${conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''}`,
      params
    );
    const total = countResult[0].total;
    
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const [results] = await db.query(query, params);
    
    // جلب مواعيد كل طبيب
    for (let doctor of results) {
      const [schedule] = await db.query(`
        SELECT 
          dwd.day_of_week, dwd.is_available,
          COUNT(ts.id) as slots_count
        FROM doctor_working_days dwd
        LEFT JOIN time_slots ts ON dwd.id = ts.doctor_working_day_id
        WHERE dwd.doctor_id = ? AND dwd.is_available = 1
        GROUP BY dwd.day_of_week, dwd.is_available
        ORDER BY FIELD(dwd.day_of_week, 'saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday')
      `, [doctor.id]);
      
      doctor.schedule = schedule;
      doctor.total_slots = schedule.reduce((sum, day) => sum + day.slots_count, 0);
      doctor.available_days = schedule.length;
    }
    
    res.json({ 
      success: true, 
      data: results,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ 
      success: false,
      message: "فشل في جلب بيانات الأطباء",
      error: err.message 
    });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctorId = parseInt(req.params.id);
    
    if (isNaN(doctorId)) {
      return res.status(400).json({
        success: false,
        message: 'معرف الطبيب غير صحيح'
      });
    }

    // 1. جلب بيانات الطبيب مع بيانات المستخدم والعمر
    const [doctorResults] = await db.query(
      `SELECT d.*, u.name, u.email, u.phone, u.gender, u.country, u.city, u.address, u.bio, u.profile_picture,
              COALESCE(u.age, TIMESTAMPDIFF(YEAR, d.date_of_birth, CURDATE())) as age
       FROM doctors d
       LEFT JOIN users u ON d.user_id = u.id
       WHERE d.id = ?`, 
      [doctorId]
    );

    if (doctorResults.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "الطبيب غير موجود" 
      });
    }

    const doctorData = doctorResults[0];

    // 2. جلب جدول العمل المبسط
    let schedule = [];
    let workSchedules = [];
    try {
      const [scheduleResult] = await db.query(`
        SELECT 
          dwd.day_of_week, dwd.is_available,
          COALESCE(COUNT(ts.id), 0) as slots_count
        FROM doctor_working_days dwd
        LEFT JOIN time_slots ts ON dwd.id = ts.doctor_working_day_id
        WHERE dwd.doctor_id = ? AND dwd.is_available = 1
        GROUP BY dwd.day_of_week, dwd.is_available
        ORDER BY FIELD(dwd.day_of_week, 'saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday')
      `, [doctorId]);
      schedule = scheduleResult;
    } catch (error) {
      console.log('Working days table issue:', error.message);
      schedule = [];
    }

    // 3. جلب التقييمات
    let ratings = [];
    try {
      const [ratingsResult] = await db.query(
        `SELECT r.rating, r.review, r.created_at, u.name as reviewer_name, u.profile_picture
         FROM doctor_ratings r
         JOIN users u ON r.user_id = u.id
         WHERE r.doctor_id = ?
         ORDER BY r.created_at DESC
         LIMIT 20`,
        [doctorId]
      );
      ratings = ratingsResult;
    } catch (error) {
      console.log('Ratings table does not exist:', error.message);
      ratings = [];
    }

    // 4. جلب المقالات
    let posts = [];
    try {
      const [postsResult] = await db.query(
        `SELECT id, title, content, featured_image, created_at, 
                likes_count, dislikes_count
         FROM doctor_posts
         WHERE doctor_id = ?
         ORDER BY created_at DESC
         LIMIT 10`,
        [doctorId]
      );
      posts = postsResult;
    } catch (error) {
      posts = [];
    }

    // 5. إحصائيات بسيطة
    let stats = {
      total_patients: 0,
      completed_appointments: 0,
      total_posts: posts.length
    };

    // تجميع البيانات
    const result = {
      ...doctorData,
      work_schedule: workSchedules,
      schedule: schedule,
      total_slots: schedule.reduce((sum, day) => sum + (day.slots_count || 0), 0),
      ratings: ratings,
      posts: posts,
      stats: stats
    };

    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Error fetching doctor:", err);
    res.status(500).json({ 
      success: false,
      message: "فشل في جلب بيانات الطبيب",
      error: err.message 
    });
  }
};

export const createDoctor = async (req, res) => {
  try {
    // التحقق من الحقول الإلزامية
    const missingFields = REQUIRED_FIELDS.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `الحقول التالية مطلوبة: ${missingFields.join(', ')}`
      });
    }

    // 1. إنشاء حساب مستخدم أولاً
    const tempPassword = generateTempPassword(); // دالة مساعدة لإنشاء كلمة مرور مؤقتة
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    
    const [userResult] = await db.query(
      `INSERT INTO users SET ?`, 
      {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        phone: req.body.phone,
        role: 'doctor',
        registration_date: new Date()
      }
    );

    // 2. إنشاء سجل الطبيب مع الربط بحساب المستخدم
    const doctorData = { 
      ...DEFAULT_VALUES, 
      ...req.body,
      user_id: userResult.insertId // ربط الطبيب بحساب المستخدم
    };
    
    const [doctorResult] = await db.query(
      `INSERT INTO doctors SET ?`,
      [doctorData]
    );

    // 3. تحديث حساب المستخدم بربطه بالطبيب
    await db.query(
      `UPDATE users SET doctor_id = ? WHERE id = ?`,
      [doctorResult.insertId, userResult.insertId]
    );

    // إرسال البريد الإلكتروني بكلمة المرور المؤقتة (يجب تنفيذه)
    // sendWelcomeEmail(req.body.email, tempPassword);

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الطبيب وحسابه بنجاح',
      data: {
        doctor_id: doctorResult.insertId,
        user_id: userResult.insertId,
         temp_password: tempPassword, // كلمة المرور الواضحة
        name: doctorData.name,
        email: doctorData.email
      }
    });

  } catch (err) {
    console.error('خطأ في إنشاء الطبيب:', err);
    
    // حذف أي بيانات تم إدخالها في حالة خطأ
    if (userResult?.insertId) {
      await db.query('DELETE FROM users WHERE id = ?', [userResult.insertId]);
    }
    if (doctorResult?.insertId) {
      await db.query('DELETE FROM doctors WHERE id = ?', [doctorResult.insertId]);
    }

    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إنشاء الطبيب',
      error: err.message
    });
  }
};
export const updateDoctor = async (req, res) => {
  try {
    const doctorId = parseInt(req.params.id);
    
    if (isNaN(doctorId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'معرف الطبيب غير صحيح' 
      });
    }

    const updateData = req.body;
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'يجب إرسال بيانات للتحديث' 
      });
    }

    // التحقق من وجود الطبيب
    const [doctor] = await db.query(
      'SELECT d.id, u.email FROM doctors d JOIN users u ON d.user_id = u.id WHERE d.id = ?', 
      [doctorId]
    );
    
    if (!doctor.length) {
      return res.status(404).json({ 
        success: false, 
        message: 'الطبيب غير موجود' 
      });
    }

    // التحقق من عدم تكرار البريد الإلكتروني
    if (updateData.email && updateData.email !== doctor[0].email) {
      const [existing] = await db.query(
        'SELECT u.id FROM users u JOIN doctors d ON u.id = d.user_id WHERE u.email = ? AND d.id != ?', 
        [updateData.email, doctorId]
      );
      if (existing.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'البريد الإلكتروني مسجل مسبقاً' 
        });
      }
    }

    // فصل بيانات المستخدم عن بيانات الطبيب
    const userFields = ['name', 'email', 'phone', 'gender', 'country', 'city', 'address', 'bio'];
    const doctorFields = ['specialization', 'title', 'certificate', 'experience_years', 'languages', 'consultation_fee'];
    
    const userData = {};
    const doctorData = {};
    
    Object.keys(updateData).forEach(key => {
      if (userFields.includes(key)) {
        userData[key] = updateData[key];
      } else if (doctorFields.includes(key)) {
        doctorData[key] = updateData[key];
      }
    });
    
    // تحديث جدول المستخدمين
    if (Object.keys(userData).length > 0) {
      // جلب user_id أولاً
      const [doctorUser] = await db.query('SELECT user_id FROM doctors WHERE id = ?', [doctorId]);
      if (doctorUser.length > 0) {
        const userUpdateQuery = Object.keys(userData).map(key => `${key} = ?`).join(', ');
        const userUpdateValues = Object.values(userData);
        userUpdateValues.push(doctorUser[0].user_id);
        
        await db.query(
          `UPDATE users SET ${userUpdateQuery} WHERE id = ?`,
          userUpdateValues
        );
      }
    }
    
    // تحديث جدول الأطباء
    if (Object.keys(doctorData).length > 0) {
      await db.query(
        `UPDATE doctors SET ? WHERE id = ?`,
        [doctorData, doctorId]
      );
    }

    res.json({ 
      success: true, 
      message: 'تم تحديث بيانات الطبيب بنجاح',
      data: {
        id: doctorId
      }
    });

  } catch (err) {
    console.error('Error updating doctor:', err);
    res.status(500).json({ 
      success: false, 
      message: 'فشل في تحديث بيانات الطبيب',
      error: err.message 
    });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const doctorId = parseInt(req.params.id);
    
    if (isNaN(doctorId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'معرف الطبيب غير صحيح' 
      });
    }

    // التحقق من وجود الطبيب
    const [doctor] = await db.query(
      'SELECT id FROM doctors WHERE id = ?', 
      [doctorId]
    );
    
    if (!doctor.length) {
      return res.status(404).json({ 
        success: false, 
        message: 'الطبيب غير موجود' 
      });
    }

    // جلب user_id قبل الحذف
    const [doctorUser] = await db.query('SELECT user_id FROM doctors WHERE id = ?', [doctorId]);
    const userId = doctorUser[0]?.user_id;

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // حذف الطبيب
      await connection.query('DELETE FROM doctors WHERE id = ?', [doctorId]);
      
      // حذف المستخدم إذا وجد
      if (userId) {
        await connection.query('DELETE FROM users WHERE id = ?', [userId]);
      }

      await connection.commit();
      connection.release();

      res.json({ 
        success: true, 
        message: 'تم حذف الطبيب بنجاح',
        data: {
          id: doctorId
        }
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }

  } catch (err) {
    console.error('Error deleting doctor:', err);
    res.status(500).json({ 
      success: false, 
      message: 'فشل في حذف الطبيب',
      error: err.message 
    });
  }
};

export const submitRating = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user?.id;

    console.log('Rating submission request:', { doctorId, rating, review, userId });

    // التحقق من وجود المستخدم
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      });
    }

    // التحقق من صحة التقييم
    if (!rating || isNaN(rating)) {
      return res.status(400).json({
        success: false,
        message: 'يجب تقديم تقييم صحيح'
      });
    }
    
    const numericRating = parseFloat(rating);
    if (numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'يجب أن يكون التقييم بين 1 و 5'
      });
    }

    // التحقق من وجود الطبيب
    const [doctor] = await db.query('SELECT id FROM doctors WHERE id = ?', [doctorId]);
    if (!doctor.length) {
      return res.status(404).json({
        success: false,
        message: 'الطبيب غير موجود'
      });
    }

    // إضافة أو تحديث التقييم باستخدام ON DUPLICATE KEY UPDATE
    await db.query(
      `INSERT INTO doctor_ratings (doctor_id, user_id, rating, review, created_at) 
       VALUES (?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE 
         rating = VALUES(rating), 
         review = VALUES(review), 
         created_at = NOW()`,
      [doctorId, userId, numericRating, review || null]
    );

    // حساب متوسط التقييمات الجديد
    const [avgResult] = await db.query(
      `SELECT 
         ROUND(AVG(rating), 1) as avg_rating, 
         COUNT(*) as total_ratings
       FROM doctor_ratings 
       WHERE doctor_id = ?`,
      [doctorId]
    );

    const avgRating = avgResult[0]?.avg_rating ?? 0;
    const totalRatings = avgResult[0]?.total_ratings ?? 0;

    // تحديث جدول الأطباء
    await db.query(
      'UPDATE doctors SET rating = ?, reviews_count = ? WHERE id = ?',
      [avgRating, totalRatings, doctorId]
    );

    console.log('Rating submitted successfully:', { avgRating, totalRatings });

    res.json({
      success: true,
      message: 'تم تسجيل التقييم بنجاح',
      data: {
        doctorId: parseInt(doctorId),
        rating: numericRating,
        averageRating: parseFloat(avgRating),
        totalRatings: parseInt(totalRatings)
      }
    });

  } catch (err) {
    console.error('Error submitting rating:', err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تسجيل التقييم',
      error: err.message
    });
  }
};

export const getDoctorRatings = async (req, res) => {
  try {
    const { doctorId } = req.params;
    let { page = 1, limit = 50 } = req.query;
    
    page = parseInt(page);
    limit = parseInt(limit);
    
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1 || limit > 100) limit = 50;
    
    const offset = (page - 1) * limit;

    console.log('Fetching ratings for doctor:', doctorId);

    // التحقق من وجود الطبيب
    const [doctor] = await db.query('SELECT id FROM doctors WHERE id = ?', [doctorId]);
    if (!doctor.length) {
      return res.status(404).json({
        success: false,
        message: 'الطبيب غير موجود'
      });
    }

    let ratings = [];
    let stats = {
      total_ratings: 0,
      average_rating: 0,
      five_stars: 0,
      four_stars: 0,
      three_stars: 0,
      two_stars: 0,
      one_star: 0
    };

    try {
      // جلب التقييمات
      const [ratingsResult] = await db.query(
        `SELECT 
           dr.id,
           dr.rating, 
           dr.review, 
           dr.created_at, 
           u.name as user_name, 
           u.profile_picture
         FROM doctor_ratings dr
         JOIN users u ON dr.user_id = u.id
         WHERE dr.doctor_id = ?
         ORDER BY dr.created_at DESC
         LIMIT ? OFFSET ?`,
        [doctorId, limit, offset]
      );
      ratings = ratingsResult;

      // جلب إحصائيات التقييم
      const [statsResult] = await db.query(
        `SELECT 
           COUNT(*) as total_ratings,
           ROUND(AVG(rating), 1) as average_rating,
           COUNT(CASE WHEN rating = 5 THEN 1 END) as five_stars,
           COUNT(CASE WHEN rating = 4 THEN 1 END) as four_stars,
           COUNT(CASE WHEN rating = 3 THEN 1 END) as three_stars,
           COUNT(CASE WHEN rating = 2 THEN 1 END) as two_stars,
           COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
         FROM doctor_ratings
         WHERE doctor_id = ?`,
        [doctorId]
      );
      stats = statsResult[0];
    } catch (tableError) {
      console.log('doctor_ratings table does not exist yet:', tableError.message);
    }

    console.log('Ratings fetched:', { count: ratings.length, stats });

    res.json({
      success: true,
      data: {
        ratings,
        stats: {
          ...stats,
          average_rating: parseFloat(stats.average_rating) || 0
        },
        pagination: {
          currentPage: page,
          totalPages: Math.ceil((stats.total_ratings || 0) / limit),
          totalItems: parseInt(stats.total_ratings) || 0,
          itemsPerPage: limit
        }
      }
    });

  } catch (err) {
    console.error('Error fetching ratings:', err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب التقييمات',
      error: err.message
    });
  }
};

export const getUserRating = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      });
    }

    const [rating] = await db.query(
      `SELECT rating, review 
       FROM doctor_ratings 
       WHERE doctor_id = ? AND user_id = ?`,
      [doctorId, userId]
    );

    res.json({
      success: true,
      data: rating[0] || null
    });

  } catch (err) {
    console.error('Error fetching user rating:', err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب تقييمك',
      error: err.message
    });
  }
};

export const deleteRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      });
    }

    // التحقق من وجود التقييم وملكية المستخدم
    const [rating] = await db.query(
      `SELECT id, doctor_id 
       FROM doctor_ratings 
       WHERE id = ? AND user_id = ?`,
      [ratingId, userId]
    );
    
    if (!rating.length) {
      return res.status(404).json({
        success: false,
        message: 'التقييم غير موجود أو ليس لديك صلاحية حذفه'
      });
    }
    
    const doctorId = rating[0].doctor_id;

    // 1. حذف التقييم
    const [deleteResult] = await db.query(
      'DELETE FROM doctor_ratings WHERE id = ?',
      [ratingId]
    );

    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'التقييم غير موجود'
      });
    }

    // 2. تحديث إحصائيات الطبيب (متوسط التقييم وعدد التقييمات)
    const [avgResult] = await db.query(
      `SELECT 
         AVG(rating) as avg_rating, 
         COUNT(*) as total_ratings
       FROM doctor_ratings 
       WHERE doctor_id = ?`,
      [doctorId]
    );

    const avgRating = avgResult[0]?.avg_rating ?? 0;
    const totalRatings = avgResult[0]?.total_ratings ?? 0;

    await db.query(
      `UPDATE doctors 
       SET rating = ?, reviews_count = ?
       WHERE id = ?`,
      [avgRating, totalRatings, doctorId]
    );

    res.json({
      success: true,
      message: 'تم حذف التقييم بنجاح',
      data: {
        doctorId,
        newAverage: avgRating,
        newTotal: totalRatings
      }
    });

  } catch (err) {
    console.error('Error deleting rating:', err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف التقييم',
      error: err.message
    });
  }
};


export const toggleDoctorVerification = async (req, res) => {
  try {
    const doctorId = parseInt(req.params.id);
    
    if (isNaN(doctorId)) {
      return res.status(400).json({
        success: false,
        message: 'معرف الطبيب غير صحيح'
      });
    }

    // التحقق من صلاحيات الإدارة
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بهذا الإجراء'
      });
    }

    // التحقق من وجود الطبيب وجلب حالة التوثيق الحالية
    const [doctor] = await db.query('SELECT verified FROM doctors WHERE id = ?', [doctorId]);
    
    if (!doctor.length) {
      return res.status(404).json({
        success: false,
        message: 'الطبيب غير موجود'
      });
    }

    // تبديل حالة التوثيق
    const newVerifiedStatus = doctor[0].verified ? 0 : 1;
    
    await db.query(
      'UPDATE doctors SET verified = ? WHERE id = ?',
      [newVerifiedStatus, doctorId]
    );

    res.json({
      success: true,
      message: `تم ${newVerifiedStatus ? 'توثيق' : 'إلغاء توثيق'} الطبيب بنجاح`,
      data: {
        doctorId,
        verified: newVerifiedStatus
      }
    });

  } catch (err) {
    console.error('Error toggling doctor verification:', err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تغيير حالة التوثيق',
      error: err.message
    });
  }
};

export const getDoctorImage = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const [doctors] = await db.query('SELECT profile_picture FROM doctors WHERE id = ?', [doctorId]);
    
    if (doctors.length === 0) {
      return res.status(404).send('الطبيب غير موجود');
    }
    
    let imagePath = doctors[0].profile_picture;
    if (!imagePath) {
      imagePath = '/uploads/default_profile.jpg';
    }
    
    if (imagePath.startsWith('/')) imagePath = imagePath.slice(1);
    return res.sendFile(imagePath, { root: process.cwd() });
  } catch (err) {
    res.status(500).send('حدث خطأ أثناء جلب صورة الطبيب');
  }
};