import { Router } from 'express';
import db from '../config/db.js';

const router = Router();

// حذف مستخدم بواسطة الإدارة - بدون حماية
router.delete('/delete-user/:id', async (req, res) => {
  try {
    const { adminCode } = req.body;
    const userId = req.params.id;

    // التحقق من الرمز السري
    if (adminCode !== 'qweasdzxc') {
      return res.status(401).json({ message: 'الرمز السري غير صحيح' });
    }

    // البحث عن المستخدم
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // حذف بيانات الطبيب إذا وجدت
      await connection.query('DELETE FROM doctors WHERE user_id = ?', [userId]);
      
      // حذف المستخدم
      await connection.query('DELETE FROM users WHERE id = ?', [userId]);

      await connection.commit();
      connection.release();

      res.json({ message: 'تم حذف المستخدم بنجاح' });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('خطأ في حذف المستخدم:', error);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});

export default router;