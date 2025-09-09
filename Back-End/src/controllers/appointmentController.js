import db from '../config/db.js';

// إعداد جدول عمل الطبيب
export const setupDoctorSchedule = async (req, res) => {
  try {
    const { workingDays } = req.body;
    const doctorId = req.params.doctorId;

    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // حذف الجدول القديم
      await connection.query('DELETE FROM time_slots WHERE doctor_working_day_id IN (SELECT id FROM doctor_working_days WHERE doctor_id = ?)', [doctorId]);
      await connection.query('DELETE FROM doctor_working_days WHERE doctor_id = ?', [doctorId]);

      // إضافة أيام العمل الجديدة
      for (const day of workingDays) {
        const [dayResult] = await connection.query(
          'INSERT INTO doctor_working_days (doctor_id, day_of_week, is_available) VALUES (?, ?, ?)',
          [doctorId, day.day_of_week, day.is_available]
        );

        if (day.is_available && day.timeSlots) {
          for (const slot of day.timeSlots) {
            await connection.query(
              'INSERT INTO time_slots (doctor_working_day_id, start_time, end_time, is_available) VALUES (?, ?, ?, ?)',
              [dayResult.insertId, slot.start_time, slot.end_time, true]
            );
          }
        }
      }

      await connection.commit();
      res.json({ success: true, message: 'تم حفظ جدول العمل بنجاح' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في حفظ جدول العمل', error: error.message });
  }
};

// جلب الأوقات المتاحة
export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });

    const [slots] = await db.query(`
      SELECT 
        ts.id,
        ts.start_time,
        ts.end_time,
        CASE 
          WHEN a.id IS NOT NULL THEN false
          ELSE ts.is_available
        END as is_available
      FROM time_slots ts
      JOIN doctor_working_days dwd ON ts.doctor_working_day_id = dwd.id
      LEFT JOIN appointments a ON ts.id = a.time_slot_id 
        AND a.appointment_date = ? 
        AND a.status IN ('pending', 'confirmed')
      WHERE dwd.doctor_id = ? 
        AND dwd.day_of_week = ? 
        AND dwd.is_available = true
      ORDER BY ts.start_time
    `, [date, doctorId, dayOfWeek]);

    res.json({ success: true, slots });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في جلب الأوقات المتاحة', error: error.message });
  }
};

// حجز موعد
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, timeSlotId, appointmentDate, appointmentTime, notes = '' } = req.body;
    const userId = req.params.userId;

    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // التحقق من وجود الطبيب
      const [doctorCheck] = await connection.query(
        'SELECT id FROM doctors WHERE id = ?',
        [doctorId]
      );

      if (doctorCheck.length === 0) {
        throw new Error('الطبيب غير موجود');
      }

      let slotInfo = null;
      
      // إذا تم تمرير timeSlotId، تحقق من توفره
      if (timeSlotId) {
        const [slotCheck] = await connection.query(`
          SELECT ts.*, dwd.doctor_id
          FROM time_slots ts
          JOIN doctor_working_days dwd ON ts.doctor_working_day_id = dwd.id
          LEFT JOIN appointments a ON ts.id = a.time_slot_id 
            AND a.appointment_date = ? 
            AND a.status IN ('pending', 'confirmed')
          WHERE ts.id = ? AND dwd.doctor_id = ? AND a.id IS NULL
        `, [appointmentDate, timeSlotId, doctorId]);

        if (slotCheck.length === 0) {
          throw new Error('الوقت المحدد غير متاح');
        }
        slotInfo = slotCheck[0];
      }

      // التحقق من عدم وجود موعد آخر في نفس التاريخ
      const [existingAppointment] = await connection.query(
        'SELECT id FROM appointments WHERE doctor_id = ? AND user_id = ? AND appointment_date = ? AND status IN ("pending", "confirmed")',
        [doctorId, userId, appointmentDate]
      );

      if (existingAppointment.length > 0) {
        throw new Error('لديك موعد محجوز بالفعل مع هذا الطبيب في نفس التاريخ');
      }

      // إنشاء الموعد
      const appointmentQuery = timeSlotId 
        ? 'INSERT INTO appointments (doctor_id, user_id, time_slot_id, appointment_date, appointment_time, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)'
        : 'INSERT INTO appointments (doctor_id, user_id, appointment_date, appointment_time, status, notes) VALUES (?, ?, ?, ?, ?, ?)';
      
      const appointmentParams = timeSlotId 
        ? [doctorId, userId, timeSlotId, appointmentDate, appointmentTime, 'pending', notes]
        : [doctorId, userId, appointmentDate, appointmentTime, 'pending', notes];

      const [appointmentResult] = await connection.query(appointmentQuery, appointmentParams);

      // إرسال رسالة طلب الحجز
      const messageText = slotInfo 
        ? `طلب حجز موعد في ${appointmentDate} من ${slotInfo.start_time} إلى ${slotInfo.end_time}`
        : `طلب حجز موعد في ${appointmentDate} في الوقت ${appointmentTime || 'غير محدد'}`;
        
      await connection.query(
        'INSERT INTO messages (doctor_id, user_id, appointment_id, message_text, status) VALUES (?, ?, ?, ?, ?)',
        [doctorId, userId, appointmentResult.insertId, messageText, 'sent']
      );

      await connection.commit();
      res.json({ success: true, message: 'تم إرسال طلب الحجز بنجاح', appointmentId: appointmentResult.insertId });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// جلب طلبات الحجز للطبيب - يستخدم doctorId من جدول doctors
export const getDoctorAppointmentRequests = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    // جلب طلبات الحجز من جدول appointments مباشرة
    const [requests] = await db.query(`
      SELECT 
        a.id as appointment_id,
        a.appointment_date,
        a.appointment_time,
        a.status as appointment_status,
        a.notes,
        a.created_at,
        u.name as patient_name,
        u.phone as patient_phone,
        ts.start_time,
        ts.end_time,
        m.id as message_id,
        m.message_text,
        m.status as message_status
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      LEFT JOIN time_slots ts ON a.time_slot_id = ts.id
      LEFT JOIN messages m ON a.id = m.appointment_id
      WHERE a.doctor_id = ? AND a.status = 'pending'
      ORDER BY a.created_at DESC
    `, [doctorId]);

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في جلب طلبات الحجز', error: error.message });
  }
};

// الرد على طلب الحجز
export const respondToAppointmentRequest = async (req, res) => {
  try {
    const { appointmentId, action, responseMessage } = req.body;
    const doctorId = req.params.doctorId;

    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      if (action === 'accept') {
        // تأكيد الموعد
        await connection.query(
          'UPDATE appointments SET status = ? WHERE id = ? AND doctor_id = ?',
          ['confirmed', appointmentId, doctorId]
        );

        // الحصول على معلومات المريض
        const [appointmentInfo] = await connection.query(
          'SELECT user_id FROM appointments WHERE id = ?',
          [appointmentId]
        );

        // إضافة المريض إلى قائمة مرضى الطبيب
        await connection.query(`
          INSERT INTO doctor_patients (doctor_id, patient_id, start_date, treatment_status, treatment_type)
          VALUES (?, ?, CURDATE(), 'active', 'consultation')
          ON DUPLICATE KEY UPDATE treatment_status = 'active'
        `, [doctorId, appointmentInfo[0].user_id]);

      } else if (action === 'reject') {
        // رفض الموعد
        await connection.query(
          'UPDATE appointments SET status = ? WHERE id = ? AND doctor_id = ?',
          ['cancelled', appointmentId, doctorId]
        );
      } else if (action === 'complete') {
        // إكمال الموعد
        await connection.query(
          'UPDATE appointments SET status = ? WHERE id = ? AND doctor_id = ?',
          ['completed', appointmentId, doctorId]
        );
      }

      // تحديث الرسالة إذا وجدت
      if (responseMessage) {
        await connection.query(
          'UPDATE messages SET response_text = ?, status = ? WHERE appointment_id = ?',
          [responseMessage, 'replied', appointmentId]
        );
      }

      await connection.commit();
      res.json({ success: true, message: 'تم تحديث حالة الموعد بنجاح' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في تحديث حالة الموعد', error: error.message });
  }
};

// جلب مواعيد الطبيب - يستخدم doctorId من جدول doctors
export const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const { date, status } = req.query;

    let query = `
      SELECT 
        a.*,
        u.name as patient_name,
        u.phone as patient_phone,
        ts.start_time,
        ts.end_time
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      LEFT JOIN time_slots ts ON a.time_slot_id = ts.id
      WHERE a.doctor_id = ?
    `;

    const params = [doctorId];

    if (date) {
      query += ' AND a.appointment_date = ?';
      params.push(date);
    }

    if (status) {
      query += ' AND a.status = ?';
      params.push(status);
    }

    query += ' ORDER BY a.appointment_date, COALESCE(ts.start_time, a.appointment_time)';

    const [appointments] = await db.query(query, params);

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في جلب المواعيد', error: error.message });
  }
};

// جلب المواعيد القادمة للطبيب (المؤكدة)
export const getDoctorUpcomingAppointments = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const today = new Date().toISOString().split('T')[0];

    const [appointments] = await db.query(`
      SELECT 
        a.*,
        u.name as patient_name,
        u.phone as patient_phone,
        u.email as patient_email,
        ts.start_time,
        ts.end_time
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      LEFT JOIN time_slots ts ON a.time_slot_id = ts.id
      WHERE a.doctor_id = ? AND a.status = 'confirmed' AND a.appointment_date >= ?
      ORDER BY a.appointment_date ASC, COALESCE(ts.start_time, a.appointment_time) ASC
    `, [doctorId, today]);

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في جلب المواعيد القادمة', error: error.message });
  }
};

// جلب مواعيد المستخدم
export const getUserAppointments = async (req, res) => {
  try {
    const userId = req.params.userId;

    const [appointments] = await db.query(`
      SELECT 
        a.*,
        u.name as doctor_name,
        d.specialization,
        ts.start_time,
        ts.end_time,
        m.response_text
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u ON d.user_id = u.id
      LEFT JOIN time_slots ts ON a.time_slot_id = ts.id
      LEFT JOIN messages m ON a.id = m.appointment_id
      WHERE a.user_id = ?
      ORDER BY a.appointment_date DESC, COALESCE(ts.start_time, a.appointment_time)
    `, [userId]);

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في جلب المواعيد', error: error.message });
  }
};

// إحصائيات الطبيب
export const getDoctorStats = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const today = new Date().toISOString().split('T')[0];

    const [todayAppointments] = await db.query(
      'SELECT COUNT(*) as count FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND status = "confirmed"',
      [doctorId, today]
    );

    const [pendingAppointments] = await db.query(
      'SELECT COUNT(*) as count FROM appointments WHERE doctor_id = ? AND status = "pending"',
      [doctorId]
    );

    const [totalPatients] = await db.query(
      'SELECT COUNT(DISTINCT patient_id) as count FROM doctor_patients WHERE doctor_id = ?',
      [doctorId]
    );

    const [monthlyAppointments] = await db.query(
      'SELECT COUNT(*) as count FROM appointments WHERE doctor_id = ? AND MONTH(appointment_date) = MONTH(CURDATE()) AND YEAR(appointment_date) = YEAR(CURDATE())',
      [doctorId]
    );

    res.json({
      success: true,
      stats: {
        todayAppointments: todayAppointments[0].count,
        pendingAppointments: pendingAppointments[0].count,
        totalPatients: totalPatients[0].count,
        monthlyAppointments: monthlyAppointments[0].count
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في جلب الإحصائيات', error: error.message });
  }
};

// جلب تقارير المرضى للطبيب
export const getDoctorPatients = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    const [patients] = await db.query(`
      SELECT 
        dp.*,
        u.name as patient_name,
        u.phone as patient_phone,
        u.email as patient_email,
        u.gender as patient_gender,
        u.city as patient_city
      FROM doctor_patients dp
      JOIN users u ON dp.patient_id = u.id
      WHERE dp.doctor_id = ?
      ORDER BY dp.start_date DESC
    `, [doctorId]);

    res.json({ success: true, patients });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطأ في جلب تقارير المرضى', error: error.message });
  }
};