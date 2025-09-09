import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import {
  setupDoctorSchedule,
  getAvailableSlots,
  bookAppointment,
  getDoctorAppointmentRequests,
  respondToAppointmentRequest,
  getDoctorAppointments,
  getDoctorUpcomingAppointments,
  getUserAppointments,
  getDoctorStats,
  getDoctorPatients
} from '../controllers/appointmentController.js';

const router = express.Router();

// إعداد جدول عمل الطبيب
router.post('/doctor/schedule/:doctorId', setupDoctorSchedule);

// جلب الأوقات المتاحة
router.get('/available-slots', getAvailableSlots);

// حجز موعد (يتطلب time_slot_id صحيح)
router.post('/book/:userId', bookAppointment);

// مسار مباشر للحجز (بدون time_slots)
router.post('/direct-book', async (req, res) => {
  try {
    const { user_id, doctor_id, appointment_date, appointment_time, notes = '', status = 'pending' } = req.body;

    console.log('Direct booking request:', { user_id, doctor_id, appointment_date, appointment_time, notes, status });

    // استيراد db من config
    const { default: db } = await import('../config/db.js');
    
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // التحقق من وجود الطبيب
      const [doctorCheck] = await connection.query(
        'SELECT id FROM doctors WHERE id = ?',
        [doctor_id]
      );

      if (doctorCheck.length === 0) {
        throw new Error('الطبيب غير موجود');
      }

      // التحقق من عدم وجود حجز في نفس الوقت والتاريخ
      const [existingAppointment] = await connection.query(
        'SELECT id FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND status IN ("pending", "confirmed")',
        [doctor_id, appointment_date]
      );

      if (existingAppointment.length > 0) {
        throw new Error('يوجد موعد محجوز بالفعل في هذا التاريخ');
      }

      // إنشاء الموعد بدون time_slot_id (سيتم تعيين NULL)
      const [appointmentResult] = await connection.query(
        'INSERT INTO appointments (doctor_id, user_id, appointment_date, status, notes, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [doctor_id, user_id, appointment_date, status, notes]
      );

      // إرسال رسالة للطبيب
      await connection.query(
        'INSERT INTO messages (doctor_id, user_id, appointment_id, message_text, status) VALUES (?, ?, ?, ?, ?)',
        [doctor_id, user_id, appointmentResult.insertId, `طلب حجز موعد في ${appointment_date} في الوقت ${appointment_time}`, 'sent']
      );

      await connection.commit();
      
      console.log('Appointment created successfully:', appointmentResult.insertId);
      
      res.json({ 
        success: true, 
        message: 'تم إرسال طلب الحجز بنجاح', 
        appointmentId: appointmentResult.insertId 
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Direct booking error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// جلب طلبات الحجز للطبيب
router.get('/doctor/requests/:doctorId', getDoctorAppointmentRequests);

// الرد على طلب الحجز
router.post('/doctor/respond/:doctorId', respondToAppointmentRequest);

// جلب مواعيد الطبيب
router.get('/doctor/appointments/:doctorId', getDoctorAppointments);

// جلب المواعيد القادمة للطبيب
router.get('/doctor/upcoming/:doctorId', getDoctorUpcomingAppointments);

// جلب مواعيد المستخدم
router.get('/user/appointments/:userId', getUserAppointments);

// إحصائيات الطبيب
router.get('/doctor/stats/:doctorId', getDoctorStats);

// تقارير المرضى
router.get('/doctor/patients/:doctorId', getDoctorPatients);

export default router;