import jwt from 'jsonwebtoken';
import { JWT_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '../config/auth.js';
import db from '../config/db.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'البريد الإلكتروني وكلمة السر مطلوبان' 
      });
    }

    const [rows] = await db.query(
      'SELECT u.id, u.name, u.email, u.role, u.gender, u.country, u.age, u.phone, u.city, u.address, u.bio, u.profile_picture, u.password, u.last_login, u.registration_date, d.id as doctorId FROM users u LEFT JOIN doctors d ON u.id = d.user_id WHERE u.email = ?',
      [email]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        field: 'email',
        message: 'البريد الإلكتروني غير صحيح' 
      });
    }

    const user = rows[0];
    
    if (password !== user.password) {
      return res.status(401).json({ 
        success: false, 
        field: 'password',
        message: 'كلمة السر غير صحيحة' 
      });
    }

    // تحديث آخر موعد تسجيل دخول
    await db.query(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    
    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
    
    await db.query(
      'UPDATE users SET refresh_token = ? WHERE id = ?',
      [refreshToken, user.id]
    );

    delete user.password;
    
    // إذا كان المستخدم طبيب ولكن لا يوجد له سجل في جدول doctors، أنشئ السجل
    if (user.role === 'doctor' && !user.doctorId) {
      try {
        const [doctorResult] = await db.query(
          `INSERT INTO doctors (user_id, title, specialization, experience_years, languages, consultation_fee) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [user.id, 'دكتور', 'أخصائي نفسي', 0, 'العربية', 0]
        );
        user.doctorId = doctorResult.insertId;
      } catch (doctorError) {
        console.error('Error creating doctor record:', doctorError);
      }
    }

    // تنسيق بيانات المستخدم لتتطابق مع الواجهة الأمامية
    const nameParts = user.name ? user.name.split(' ') : ['مستخدم'];
    const formattedUser = {
      ...user,
      firstName: nameParts[0] || 'مستخدم',
      lastName: nameParts.slice(1).join(' ') || '',
      doctorId: user.doctorId
    };
    
    res.json({ 
      success: true, 
      accessToken,
      refreshToken,
      user: formattedUser
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'حدث خطأ أثناء محاولة تسجيل الدخول',
      error: error.message
    });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ error: 'توكن التحديث مطلوب' });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const [user] = await db.query(
      'SELECT id, role, refresh_token FROM users WHERE id = ?',
      [decoded.id]
    );
    
    if (!user[0] || user[0].refresh_token !== refreshToken) {
      return res.status(403).json({ error: 'توكن التحديث غير صالح' });
    }
    
    const newAccessToken = jwt.sign(
      { id: user[0].id, role: user[0].role },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    
    res.json({ 
      success: true,
      accessToken: newAccessToken 
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(403).json({ error: 'توكن التحديث غير صالح' });
  }
};

export const logout = async (req, res) => {
  try {
    await db.query(
      'UPDATE users SET refresh_token = NULL WHERE id = ?',
      [req.user.id]
    );
    
    res.json({ 
      success: true,
      message: 'تم تسجيل الخروج بنجاح' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false,
      error: 'حدث خطأ أثناء تسجيل الخروج' 
    });
  }
};

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      gender,
      age,
      country,
      phone,
      city,
      address,
      bio, 
      role
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'الاسم، البريد الإلكتروني وكلمة السر مطلوبة'
      });
    }

    const [existingUser] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'هذا البريد الإلكتروني مسجل بالفعل'
      });
    }

    // معالجة الصورة الشخصية
    let profilePicture = null;
    if (req.file) {
      profilePicture = `/uploads/${req.file.filename}`;
    }

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // إنشاء المستخدم
      const [result] = await connection.query(
        `INSERT INTO users 
        (name, email, password, gender, age, country, phone, city, address, bio, role, profile_picture)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, email, password, gender, age, country, phone, city, address, bio, role, profilePicture]
      );

      const userId = result.insertId;

      // إذا كان المستخدم طبيب، أضف بياناته في جدول الأطباء
      if (role === 'doctor') {
        // لا حاجة للتحقق من جدول doctors لأن email لم يعد موجوداً فيه

        const {
          date_of_birth,
          certificate,
          title,
          specialization,
          sub_specialization,
          experience_years,
          languages,
          consultation_fee
        } = req.body;

        await connection.query(
          `INSERT INTO doctors 
          (user_id, date_of_birth, certificate, title, specialization, sub_specialization, experience_years, languages, consultation_fee) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            date_of_birth || '1990-01-01',
            certificate || 'شهادة في الطب النفسي',
            title || 'دكتور',
            specialization || 'أخصائي نفسي',
            sub_specialization || null,
            experience_years || 0,
            languages || 'العربية',
            consultation_fee || 0
          ]
        );
      }

      const [newUser] = await connection.query(
        'SELECT id, name, email, role, gender, age, country FROM users WHERE id = ?',
        [userId]
      );

      await connection.commit();
      connection.release();

      const accessToken = jwt.sign(
        { id: newUser[0].id, role: newUser[0].role },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
      );
      
      const refreshToken = jwt.sign(
        { id: newUser[0].id },
        JWT_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
      );
      
      await db.query(
        'UPDATE users SET refresh_token = ? WHERE id = ?',
        [refreshToken, newUser[0].id]
      );

      res.status(201).json({
        success: true,
        message: role === 'doctor' ? 'تم تسجيل حساب الطبيب بنجاح' : 'تم تسجيل الحساب بنجاح',
        accessToken,
        refreshToken,
        user: newUser[0]
      });

    } catch (transactionError) {
      await connection.rollback();
      connection.release();
      throw transactionError;
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تسجيل الحساب',
      error: error.message
    });
  }
};