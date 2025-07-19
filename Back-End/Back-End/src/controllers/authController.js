import jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from "../config/auth.js";
import db from "../config/db.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "البريد الإلكتروني وكلمة السر مطلوبان",
      });
    }

    const [rows] = await db.query(
      "SELECT id, name, email, role, gender, country, age, phone, city, address, bio, password FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "البريد الإلكتروني أو كلمة السر غير صحيحة",
      });
    }

    const user = rows[0];

    if (password !== user.password) {
      return res.status(401).json({
        success: false,
        message: "البريد الإلكتروني أو كلمة السر غير صحيحة",
      });
    }

    const accessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    await db.query("UPDATE users SET refresh_token = ? WHERE id = ?", [
      refreshToken,
      user.id,
    ]);

    delete user.password;
    res.json({
      success: true,
      accessToken,
      refreshToken,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء محاولة تسجيل الدخول",
      error: error.message,
    });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "توكن التحديث مطلوب" });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const [user] = await db.query(
      "SELECT id, role, refresh_token FROM users WHERE id = ?",
      [decoded.id]
    );

    if (!user[0] || user[0].refresh_token !== refreshToken) {
      return res.status(403).json({ error: "توكن التحديث غير صالح" });
    }

    const newAccessToken = jwt.sign(
      { id: user[0].id, role: user[0].role },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(403).json({ error: "توكن التحديث غير صالح" });
  }
};

export const logout = async (req, res) => {
  try {
    await db.query("UPDATE users SET refresh_token = NULL WHERE id = ?", [
      req.user.id,
    ]);

    res.json({
      success: true,
      message: "تم تسجيل الخروج بنجاح",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء تسجيل الخروج",
    });
  }
};

export const updateDoktorInfo = async (req, res) => {
  const { id } = req.user;
  const { name, date_of_birth } = req.body;

  // التحقق من وجود الحقول المطلوبة
  if (!name || !date_of_birth || !profile_image) {
    return res.status(400).json({
      success: false,
      message: "الاسم، الصورة وتاريخ الميلاد مطلوبة",
    });
  }

  try {
    // التحقق من وجود المستخدم في جدول الأطباء (doctors)
    const [existingUserRows] = await db.query(
      "SELECT * FROM doctors WHERE id = ?",
      [id]
    );

    if (existingUserRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "هذا المستخدم غير موجود",
      });
    }

    // تنفيذ التعديل
    await db.execute(
      "UPDATE doctors SET name = ?, date_of_birth = ? WHERE id = ?",
      [name, date_of_birth, id]
    );

    // إعادة البيانات الجديدة (اختياري)
    const [updatedDoctorRows] = await db.query(
      "SELECT id, name, date_of_birth, profile_image FROM doctors WHERE id = ?",
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "تم تعديل المعلومات بنجاح",
      data: updatedDoctorRows[0],
    });
  } catch (error) {
    console.error("update error:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء تعديل المعلومات",
      error: error.message,
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
      role,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "الاسم، البريد الإلكتروني وكلمة السر مطلوبة",
      });
    }

    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "هذا البريد الإلكتروني مسجل بالفعل",
      });
    }

    const [result] = await db.query(
      `INSERT INTO users 
      (name, email, password, gender, age, country, phone, city, address, bio, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
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
        role,
      ]
    );

    const [newUser] = await db.query(
      "SELECT id, name, email, role, gender, age, country FROM users WHERE id = ?",
      [result.insertId]
    );

    const accessToken = jwt.sign(
      { id: newUser[0].id, role: newUser[0].role },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign({ id: newUser[0].id }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    await db.query("UPDATE users SET refresh_token = ? WHERE id = ?", [
      refreshToken,
      newUser[0].id,
    ]);

    res.status(201).json({
      success: true,
      message: "تم تسجيل الحساب بنجاح",
      accessToken,
      refreshToken,
      user: newUser[0],
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء تسجيل الحساب",
      error: error.message,
    });
  }
};
