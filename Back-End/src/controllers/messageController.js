import db from '../config/db.js';

// إرسال رسالة جديدة
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, subject, content, appointmentId } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !subject || !content) {
      return res.status(400).json({
        success: false,
        message: 'معرف المستقبل والموضوع والمحتوى مطلوبة'
      });
    }

    const [result] = await db.query(
      `INSERT INTO messages (sender_id, receiver_id, subject, content, appointment_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [senderId, receiverId, subject, content, appointmentId || null]
    );

    res.json({
      success: true,
      message: 'تم إرسال الرسالة بنجاح',
      messageId: result.insertId
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إرسال الرسالة'
    });
  }
};

// جلب الرسائل الواردة
export const getInboxMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const [messages] = await db.query(
      `SELECT 
        m.id,
        m.message_text,
        m.response_text,
        m.status,
        m.created_at,
        u.name as doctor_name,
        u.profile_picture as doctor_picture,
        CASE WHEN m.status = 'read' THEN 1 ELSE 0 END as is_read
      FROM messages m
      JOIN doctors d ON m.doctor_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE m.user_id = ?
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?`,
      [userId, parseInt(limit), parseInt(offset)]
    );

    // تنسيق البيانات
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      message_text: msg.message_text,
      response_text: msg.response_text,
      is_read: msg.is_read === 1,
      status: msg.status,
      created_at: msg.created_at,
      doctor_name: msg.doctor_name
    }));

    // عد إجمالي الرسائل
    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM messages WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      messages: formattedMessages
    });

  } catch (error) {
    console.error('Get inbox messages error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الرسائل الواردة'
    });
  }
};

// جلب عدد الرسائل غير المقروءة
export const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const [result] = await db.query(
      'SELECT COUNT(*) as unread_count FROM messages WHERE user_id = ? AND status = "sent"',
      [userId]
    );

    res.json({
      success: true,
      count: result[0].unread_count
    });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب عدد الرسائل غير المقروءة'
    });
  }
};

// قراءة رسالة محددة
export const getMessage = async (req, res) => {
  try {
    const { messageId, userId } = req.params;

    const [messages] = await db.query(
      `SELECT 
        m.*,
        u.name as doctor_name
      FROM messages m
      JOIN doctors d ON m.doctor_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE m.id = ? AND m.user_id = ?`,
      [messageId, userId]
    );

    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'الرسالة غير موجودة'
      });
    }

    const message = messages[0];

    // تحديث حالة القراءة
    if (message.status === 'sent') {
      await db.query(
        'UPDATE messages SET status = "read" WHERE id = ?',
        [messageId]
      );
      message.status = 'read';
    }

    const formattedMessage = {
      id: message.id,
      message_text: message.message_text,
      response_text: message.response_text,
      status: message.status,
      created_at: message.created_at,
      doctor_name: message.doctor_name
    };

    res.json({
      success: true,
      message: formattedMessage
    });

  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الرسالة'
    });
  }
};

// الرد على رسالة
export const replyToMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { replyText } = req.body;

    if (!replyText) {
      return res.status(400).json({
        success: false,
        message: 'محتوى الرد مطلوب'
      });
    }

    // تحديث الرسالة الأصلية بالرد
    const [result] = await db.query(
      'UPDATE messages SET response_text = ?, status = "replied" WHERE id = ?',
      [replyText, messageId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'الرسالة غير موجودة'
      });
    }

    res.json({
      success: true,
      message: 'تم إرسال الرد بنجاح'
    });

  } catch (error) {
    console.error('Reply to message error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إرسال الرد'
    });
  }
};

// جلب رسائل الطبيب مع ردود المرضى
export const getDoctorMessages = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const [messages] = await db.query(
      `SELECT 
        m.id,
        m.message_text,
        m.response_text,
        m.status,
        m.created_at,
        u.name as patient_name,
        u.profile_picture as patient_picture,
        CASE WHEN m.response_text IS NOT NULL THEN 1 ELSE 0 END as has_reply
      FROM messages m
      JOIN users u ON m.user_id = u.id
      WHERE m.doctor_id = ?
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?`,
      [doctorId, parseInt(limit), parseInt(offset)]
    );

    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      message_text: msg.message_text,
      response_text: msg.response_text,
      status: msg.status,
      created_at: msg.created_at,
      patient_name: msg.patient_name,
      has_reply: msg.has_reply === 1
    }));

    res.json({
      success: true,
      messages: formattedMessages
    });

  } catch (error) {
    console.error('Get doctor messages error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الرسائل'
    });
  }
};

// حذف رسالة
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const [message] = await db.query(
      'SELECT * FROM messages WHERE id = ?',
      [messageId]
    );

    if (message.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'الرسالة غير موجودة'
      });
    }

    await db.query('DELETE FROM messages WHERE id = ?', [messageId]);

    res.json({
      success: true,
      message: 'تم حذف الرسالة بنجاح'
    });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف الرسالة'
    });
  }
};