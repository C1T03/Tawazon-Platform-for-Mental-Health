import db from '../config/db.js';

// إرسال رسالة تواصل جديدة
export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'جميع الحقول مطلوبة'
      });
    }

    const [result] = await db.query(
      `INSERT INTO contact_messages (name, email, subject, message) 
       VALUES (?, ?, ?, ?)`,
      [name, email, subject, message]
    );

    res.json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً',
      messageId: result.insertId
    });

  } catch (error) {
    console.error('Send contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إرسال الرسالة'
    });
  }
};

// جلب جميع رسائل التواصل (للإدارة)
export const getContactMessages = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let queryParams = [];

    if (status && ['new', 'read', 'replied'].includes(status)) {
      whereClause = 'WHERE status = ?';
      queryParams.push(status);
    }

    const [messages] = await db.query(
      `SELECT * FROM contact_messages 
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), parseInt(offset)]
    );

    // عد إجمالي الرسائل
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM contact_messages ${whereClause}`,
      queryParams
    );

    res.json({
      success: true,
      messages,
      pagination: {
        currentPage: parseInt(page),
        totalMessages: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });

  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الرسائل'
    });
  }
};

// جلب رسالة تواصل محددة
export const getContactMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const [messages] = await db.query(
      'SELECT * FROM contact_messages WHERE id = ?',
      [messageId]
    );

    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'الرسالة غير موجودة'
      });
    }

    // تحديث حالة الرسالة إلى مقروءة
    await db.query(
      'UPDATE contact_messages SET status = ? WHERE id = ? AND status = ?',
      ['read', messageId, 'new']
    );

    res.json({
      success: true,
      message: messages[0]
    });

  } catch (error) {
    console.error('Get contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الرسالة'
    });
  }
};

// تحديث حالة رسالة التواصل
export const updateMessageStatus = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status } = req.body;

    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'حالة غير صحيحة'
      });
    }

    const [result] = await db.query(
      'UPDATE contact_messages SET status = ? WHERE id = ?',
      [status, messageId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'الرسالة غير موجودة'
      });
    }

    res.json({
      success: true,
      message: 'تم تحديث حالة الرسالة بنجاح'
    });

  } catch (error) {
    console.error('Update message status error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث حالة الرسالة'
    });
  }
};

// حذف رسالة تواصل
export const deleteContactMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const [result] = await db.query(
      'DELETE FROM contact_messages WHERE id = ?',
      [messageId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'الرسالة غير موجودة'
      });
    }

    res.json({
      success: true,
      message: 'تم حذف الرسالة بنجاح'
    });

  } catch (error) {
    console.error('Delete contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف الرسالة'
    });
  }
};

// إحصائيات رسائل التواصل
export const getContactStats = async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_messages,
        SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as read_messages,
        SUM(CASE WHEN status = 'replied' THEN 1 ELSE 0 END) as replied_messages
      FROM contact_messages
    `);

    res.json({
      success: true,
      stats: stats[0]
    });

  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الإحصائيات'
    });
  }
};