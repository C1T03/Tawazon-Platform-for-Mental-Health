// src/controllers/userController.js
import db from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

// حل مشكلة __dirname في ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getUsers = async (req, res) => {
  try {
    const [results] = await db.query("SELECT id, name, email, role, city, profile_picture FROM users");
    res.json(results);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Error fetching data from database");
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM users");
    res.json(results);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Error fetching data from database");
  }
};

// حذف دالة updateCity واستبدالها بدالة عامة لتحديث بيانات المستخدم
export const updateUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    const allowedFields = [
      'name', 'email', 'gender', 'age', 'country', 'phone', 'city', 'address', 'bio'
    ];
    const fields = Object.keys(req.body).filter(key => allowedFields.includes(key));
    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'يجب إرسال بيانات صالحة للتحديث'
      });
    }
    const setClause = fields.map(key => `${key} = ?`).join(', ');
    const values = fields.map(key => req.body[key]);
    values.push(userId);
    await db.query(
      `UPDATE users SET ${setClause} WHERE id = ?`,
      values
    );
    res.json({
      success: true,
      message: 'تم تحديث بيانات المستخدم بنجاح'
    });
  } catch (error) {
    console.error('Update user data error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث بيانات المستخدم',
      error: error.message
    });
  }
};

// دالة جديدة لتحديث صورة الملف الشخصي
export const updateProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'لم يتم تحميل أي صورة'
      });
    }

    const profileImage = `/uploads/${req.file.filename}`;

    // الحصول على الصورة القديمة لحذفها
    const [user] = await db.query('SELECT profile_picture FROM users WHERE id = ?', [userId]);
    const oldImage = user[0]?.profile_picture;

    // تحديث الصورة في قاعدة البيانات
    await db.query(
      'UPDATE users SET profile_picture = ? WHERE id = ?',
      [profileImage, userId]
    );

    // حذف الصورة القديمة من الخادم
    if (oldImage) {
      const oldImagePath = path.join(__dirname, '..', oldImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('فشل في حذف الصورة القديمة:', err);
        });
      }
    }

    res.json({
      success: true,
      message: 'تم تحديث صورة الملف الشخصي بنجاح',
      imageUrl: profileImage,
      field: 'profile_picture'
    });
  } catch (error) {
    console.error('Update profile image error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث الصورة',
      error: error.message
    });
  }
};

// دالة جديدة للحصول على بيانات المستخدم الحالي
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      'SELECT id, name, email, role, gender, age, country, city, phone, address, bio, profile_picture, last_login, registration_date FROM users WHERE id = ?', 
      [userId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    res.json({
      success: true,
      user: rows[0]
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب بيانات المستخدم'
    });
  }
};

// جلب بيانات الطبيب مع مواعيده وأوقات عمله
export const getDoctorProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // جلب بيانات المستخدم والطبيب
    const [userRows] = await db.query(`
      SELECT 
        u.id, u.name, u.email, u.role, u.gender, u.age, u.country, u.city, 
        u.phone, u.address, u.bio, u.profile_picture, u.last_login, u.registration_date,
        d.id as doctor_id, d.title, d.specialization, d.sub_specialization, 
        d.experience_years, d.languages, d.rating, d.reviews_count, 
        d.patients_count, d.consultation_fee, d.working_hours, 
        d.emergency_available, d.online_consultation, d.verified
      FROM users u
      LEFT JOIN doctors d ON u.id = d.user_id
      WHERE u.id = ?
    `, [userId]);
    
    if (userRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    const userData = userRows[0];
    
    // إذا كان المستخدم طبيب، جلب أوقات العمل والمواعيد
    if (userData.role === 'doctor' && userData.doctor_id) {
      // جلب أوقات العمل باستخدام doctor_id من جدول doctors
      const [workingDays] = await db.query(`
        SELECT 
          dwd.id, dwd.day_of_week, dwd.is_available,
          ts.id as slot_id, ts.start_time, ts.end_time, ts.is_available as slot_available
        FROM doctor_working_days dwd
        LEFT JOIN time_slots ts ON dwd.id = ts.doctor_working_day_id
        WHERE dwd.doctor_id = ?
        ORDER BY 
          FIELD(dwd.day_of_week, 'saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'),
          ts.start_time
      `, [userData.doctor_id || userId]);

      // تنظيم أوقات العمل
      const schedule = {};
      workingDays.forEach(row => {
        if (!schedule[row.day_of_week]) {
          schedule[row.day_of_week] = {
            day_of_week: row.day_of_week,
            is_available: row.is_available,
            time_slots: []
          };
        }
        if (row.slot_id) {
          schedule[row.day_of_week].time_slots.push({
            id: row.slot_id,
            start_time: row.start_time,
            end_time: row.end_time,
            is_available: row.slot_available
          });
        }
      });

      // جلب المواعيد القادمة باستخدام doctor_id
      const [upcomingAppointments] = await db.query(`
        SELECT 
          a.id, a.appointment_date, a.status, a.notes,
          u.name as patient_name, u.phone as patient_phone,
          ts.start_time, ts.end_time
        FROM appointments a
        JOIN users u ON a.user_id = u.id
        JOIN time_slots ts ON a.time_slot_id = ts.id
        WHERE a.doctor_id = ? AND a.appointment_date >= CURDATE()
        ORDER BY a.appointment_date, ts.start_time
        LIMIT 10
      `, [userData.doctor_id || userId]);

      userData.schedule = Object.values(schedule);
      userData.upcoming_appointments = upcomingAppointments;
    }

    res.json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Get doctor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب بيانات الطبيب'
    });
  }
};

export const getProfileImage = async (req, res) => {
  try {
    const userId = req.params.id;
    const [users] = await db.query('SELECT profile_picture FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).send('المستخدم غير موجود');
    }
    let imagePath = users[0].profile_picture;
    if (!imagePath) {
      imagePath = '/uploads/default_profile.jpg';
    }
    // إزالة / من البداية إذا موجودة
    if (imagePath.startsWith('/')) imagePath = imagePath.slice(1);
    return res.sendFile(imagePath, { root: process.cwd() });
  } catch (err) {
    res.status(500).send('حدث خطأ أثناء جلب صورة البروفايل');
  }
};


// src/controllers/userController.js
export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id; // ID من التوكن
    const { password } = req.body; // كلمة المرور المرسلة من العميل

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'يجب إدخال كلمة المرور للتأكيد'
      });
    }

    // جلب المستخدم + كلمة المرور المشفرة من DB
    const [user] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    // التحقق من كلمة المرور باستخدام bcrypt
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'كلمة المرور غير صحيحة'
      });
    }

    // حذف الصورة الشخصية إن وجدت (نفس الكود السابق)
    if (user[0].profile_picture) {
      const imagePath = path.join(__dirname, '..', user[0].profile_picture);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // التنفيذ النهائي للحذف
    await db.query('DELETE FROM users WHERE id = ?', [userId]);

    res.json({
      success: true,
      message: 'تم حذف الحساب بنجاح'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف الحساب'
    });
  }
};




// src/controllers/userController.js

/**
 * إضافة طبيب إلى المفضلة
 */
/**
 * حذف طبيب من المفضلة
 */
// إضافة طبيب إلى المفضلة (بدون حماية)
export const addFavoriteDoctor = async (req, res) => {
  try {
    const { userId, doctorId } = req.body;

    if (!userId || !doctorId) {
      return res.status(400).json({
        success: false,
        message: 'يجب توفير معرف المستخدم ومعرف الطبيب'
      });
    }

    // التحقق من وجود الطبيب
    const [doctor] = await db.query('SELECT id FROM doctors WHERE id = ?', [doctorId]);
    if (doctor.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'الطبيب غير موجود'
      });
    }

    // التحقق من عدم وجود الطبيب في المفضلة بالفعل
    const [existing] = await db.query(
      'SELECT * FROM user_favorite_doctors WHERE user_id = ? AND doctor_id = ?',
      [userId, doctorId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'الطبيب مضاف بالفعل إلى المفضلة'
      });
    }

    // إضافة الطبيب إلى المفضلة
    await db.query(
      'INSERT INTO user_favorite_doctors (user_id, doctor_id) VALUES (?, ?)',
      [userId, doctorId]
    );

    res.json({
      success: true,
      message: 'تمت إضافة الطبيب إلى المفضلة بنجاح'
    });

  } catch (error) {
    console.error('Add favorite doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إضافة الطبيب إلى المفضلة',
      error: error.message
    });
  }
};

// إزالة طبيب من المفضلة (بدون حماية)
export const removeFavoriteDoctor = async (req, res) => {
  try {
    const { userId, doctorId } = req.body;

    if (!userId || !doctorId) {
      return res.status(400).json({
        success: false,
        message: 'يجب توفير معرف المستخدم ومعرف الطبيب'
      });
    }

    // التحقق من وجود الطبيب في المفضلة
    const [existing] = await db.query(
      'SELECT * FROM user_favorite_doctors WHERE user_id = ? AND doctor_id = ?',
      [userId, doctorId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'الطبيب غير موجود في المفضلة'
      });
    }

    // حذف الطبيب من المفضلة
    await db.query(
      'DELETE FROM user_favorite_doctors WHERE user_id = ? AND doctor_id = ?',
      [userId, doctorId]
    );

    res.json({
      success: true,
      message: 'تم حذف الطبيب من المفضلة بنجاح'
    });

  } catch (error) {
    console.error('Remove favorite doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف الطبيب من المفضلة',
      error: error.message
    });
  }
};

// التحقق من حالة المفضلة (بدون حماية)
export const checkFavoriteStatus = async (req, res) => {
  try {
    const { userId, doctorId } = req.query;

    if (!userId || !doctorId) {
      return res.status(400).json({
        success: false,
        message: 'يجب توفير معرف المستخدم ومعرف الطبيب'
      });
    }

    const [existing] = await db.query(
      'SELECT * FROM user_favorite_doctors WHERE user_id = ? AND doctor_id = ?',
      [userId, doctorId]
    );

    res.json({
      success: true,
      isFavorite: existing.length > 0
    });

  } catch (error) {
    console.error('Check favorite status error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء التحقق من حالة المفضلة'
    });
  }
};

// جلب قائمة الأطباء المفضلين (بدون حماية)
export const getFavoriteDoctors = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'يجب توفير معرف المستخدم'
      });
    }

    const [favoriteDoctors] = await db.query(
      `SELECT 
        d.id,
        u.name,
        u.profile_picture,
        d.title,
        d.specialization,
        d.rating,
        d.reviews_count,
        ufd.created_at as added_to_favorites_at
      FROM user_favorite_doctors ufd
      JOIN doctors d ON ufd.doctor_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE ufd.user_id = ?
      ORDER BY ufd.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      favoriteDoctors: favoriteDoctors,
      count: favoriteDoctors.length
    });

  } catch (error) {
    console.error('Get favorite doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الأطباء المفضلين',
      error: error.message
    });
  }
};

// جلب جميع الأطباء مع مواعيدهم
export const getAllDoctorsWithSchedule = async (req, res) => {
  try {
    // جلب جميع الأطباء
    const [doctors] = await db.query(`
      SELECT 
        u.id as user_id, u.name, u.email, u.profile_picture, u.city, u.country,
        d.id as doctor_id, d.title, d.specialization, d.experience_years, 
        d.rating, d.reviews_count, d.consultation_fee, d.certificate, d.languages
      FROM users u
      JOIN doctors d ON u.id = d.user_id
      WHERE u.role = 'doctor'
      ORDER BY d.rating DESC, d.reviews_count DESC
    `);

    // جلب مواعيد كل طبيب
    for (let doctor of doctors) {
      const [schedule] = await db.query(`
        SELECT 
          dwd.day_of_week, dwd.is_available,
          COUNT(ts.id) as slots_count
        FROM doctor_working_days dwd
        LEFT JOIN time_slots ts ON dwd.id = ts.doctor_working_day_id
        WHERE dwd.doctor_id = ? AND dwd.is_available = 1
        GROUP BY dwd.day_of_week, dwd.is_available
        ORDER BY FIELD(dwd.day_of_week, 'saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday')
      `, [doctor.doctor_id]);
      
      doctor.schedule = schedule;
      doctor.total_slots = schedule.reduce((sum, day) => sum + day.slots_count, 0);
    }

    res.json({
      success: true,
      doctors: doctors
    });
  } catch (error) {
    console.error('Get all doctors with schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب بيانات الأطباء'
    });
  }
};

// حذف مستخدم بواسطة الأدمن
export const deleteUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminPassword } = req.body;
    const adminId = req.user.id;

    if (!adminPassword) {
      return res.status(400).json({
        success: false,
        message: 'يجب إدخال كلمة مرور الأدمن للتأكيد'
      });
    }

    // التحقق من أن المستخدم الحالي هو أدمن
    const [admin] = await db.query('SELECT * FROM users WHERE id = ? AND role = "admin"', [adminId]);
    if (admin.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بهذا الإجراء'
      });
    }

    // التحقق من كلمة مرور الأدمن
    const isMatch = await bcrypt.compare(adminPassword, admin[0].password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'كلمة مرور الأدمن غير صحيحة'
      });
    }

    // منع الأدمن من حذف نفسه
    if (parseInt(id) === adminId) {
      return res.status(400).json({
        success: false,
        message: 'لا يمكنك حذف حسابك الخاص'
      });
    }

    // جلب بيانات المستخدم المراد حذفه
    const [user] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    // بدء المعاملة
    await db.query('START TRANSACTION');

    try {
      // حذف البيانات المرتبطة
      await db.query('DELETE FROM user_interactions WHERE user_id = ?', [id]);
      await db.query('DELETE FROM posts WHERE user_id = ?', [id]);
      await db.query('DELETE FROM user_favorite_doctors WHERE user_id = ?', [id]);
      
      // حذف سجل الطبيب إذا كان المستخدم طبيباً
      if (user[0].role === 'doctor') {
        await db.query('DELETE FROM doctors WHERE user_id = ?', [id]);
      }

      // حذف المستخدم
      await db.query('DELETE FROM users WHERE id = ?', [id]);

      // حذف صورة الملف الشخصي
      if (user[0].profile_picture) {
        const imagePath = path.join(__dirname, '..', user[0].profile_picture);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await db.query('COMMIT');

      res.json({
        success: true,
        message: 'تم حذف المستخدم بنجاح'
      });

    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Delete user by admin error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف المستخدم'
    });
  }
};