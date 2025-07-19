// src/controllers/userController.js
import db from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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







export const updateCity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { city } = req.body;

    if (!city) {
      return res.status(400).json({ 
        success: false, 
        message: 'يجب تقديم اسم المدينة' 
      });
    }
    
    await db.query(
      'UPDATE users SET city = ? WHERE id = ?',
      [city, userId]
    );

    res.json({ 
      success: true,
      message: 'تم تحديث المدينة بنجاح'
    });
  } catch (error) {
    console.error('Update city error:', error);
    res.status(500).json({ 
      success: false,
      message: 'حدث خطأ أثناء تحديث المدينة',
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
    const [user] = await db.query('SELECT profile_image FROM users WHERE id = ?', [userId]);
    const oldImage = user[0]?.profile_image;

    // تحديث الصورة في قاعدة البيانات
    await db.query(
      'UPDATE users SET profile_image = ? WHERE id = ?',
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
      imageUrl: profileImage
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
      'SELECT id, name, email, role, city, profile_image FROM users WHERE id = ?', 
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