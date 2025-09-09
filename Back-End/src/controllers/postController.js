import db from '../config/db.js';

// أنواع التفاعلات المسموحة
const ALLOWED_INTERACTIONS = new Set(['like', 'dislike']);

/**
 * إدارة تفاعلات المنشورات
 */
export const interactPost = async (req, res) => {
  const { id: postId } = req.params;
  const { id: userId } = req.user;
  const { interactionType } = req.body;

  // التحقق من صحة نوع التفاعل
  if (!ALLOWED_INTERACTIONS.has(interactionType)) {
    return res.status(400).json({
      status: 'error',
      message: 'نوع التفاعل غير صالح',
      validTypes: Array.from(ALLOWED_INTERACTIONS)
    });
  }

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // التحقق من وجود المنشور
    const [post] = await connection.query(
      'SELECT id FROM doctor_posts WHERE id = ?',
      [postId]
    );

    if (!post.length) {
      await connection.rollback();
      return res.status(404).json({
        status: 'error',
        message: 'المنشور غير موجود'
      });
    }

    // البحث عن تفاعل سابق
    const [existing] = await connection.query(
      `SELECT id, interaction_type 
       FROM post_interactions 
       WHERE post_id = ? AND user_id = ? 
       LIMIT 1`,
      [postId, userId]
    );

    let message;
    const isExisting = existing.length > 0;
    const existingType = isExisting ? existing[0].interaction_type : null;

    if (isExisting && existingType === interactionType) {
      // إزالة التفاعل إذا كان مكرراً
      await connection.query(
        'DELETE FROM post_interactions WHERE id = ?',
        [existing[0].id]
      );
      message = 'تم إلغاء التفاعل';
    } else if (isExisting) {
      // تحديث التفاعل إذا كان مختلفاً
      await connection.query(
        'UPDATE post_interactions SET interaction_type = ? WHERE id = ?',
        [interactionType, existing[0].id]
      );
      message = 'تم تحديث التفاعل';
    } else {
      // إضافة تفاعل جديد
      await connection.query(
        `INSERT INTO post_interactions 
         (post_id, user_id, interaction_type) 
         VALUES (?, ?, ?)`,
        [postId, userId, interactionType]
      );
      message = 'تم إضافة التفاعل';
    }

    // تحديث العدادات
    await updatePostCounters(connection, postId);

    await connection.commit();
    res.json({
      status: 'success',
      message
    });

  } catch (error) {
    await connection.rollback();
    console.error('Interaction Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'فشل في معالجة التفاعل',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  } finally {
    connection.release();
  }
};

/**
 * مساعد لتحديث عدادات التفاعلات
 */
async function updatePostCounters(connection, postId) {
  const [counts] = await connection.query(
    `SELECT 
       SUM(interaction_type = 'like') as likes,
       SUM(interaction_type = 'dislike') as dislikes
     FROM post_interactions
     WHERE post_id = ?`,
    [postId]
  );

  await connection.query(
    `UPDATE doctor_posts 
     SET likes_count = ?, dislikes_count = ?
     WHERE id = ?`,
    [counts[0].likes || 0, counts[0].dislikes || 0, postId]
  );
}

/**
 * الحصول على تفاعلات المنشور
 */
export const getPostInteractions = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    // الحصول على إجمالي التفاعلات
    const [post] = await db.query(
      `SELECT likes_count, dislikes_count 
       FROM doctor_posts 
       WHERE id = ?`,
      [postId]
    );

    if (!post.length) {
      return res.status(404).json({
        status: 'error',
        message: 'المنشور غير موجود'
      });
    }

    // الحصول على التفاعلات مع معلومات المستخدم
    const [interactions] = await db.query(
      `SELECT pi.*, u.name as user_name, u.profile_picture
       FROM post_interactions pi
       JOIN users u ON pi.user_id = u.id
       WHERE pi.post_id = ?
       ORDER BY pi.interacted_at DESC
       LIMIT ? OFFSET ?`,
      [postId, parseInt(limit), parseInt(offset)]
    );

    res.json({
      status: 'success',
      data: {
        likes: post[0].likes_count,
        dislikes: post[0].dislikes_count,
        interactions,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: post[0].likes_count + post[0].dislikes_count
        }
      }
    });

  } catch (error) {
    console.error('Fetch Interactions Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'فشل في جلب التفاعلات',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

/**
 * الحصول على منشورات الطبيب
 */
export const getDoctorPosts = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    // الحصول على المنشورات مع معلومات الطبيب والعدادات
    const [posts] = await db.query(
      `SELECT 
         p.*, 
         u.name AS doctor_name,
         u.profile_picture AS doctor_profile_picture,
         d.specialization AS doctor_specialty,
         (SELECT COUNT(*) FROM post_interactions 
          WHERE post_id = p.id AND interaction_type = 'like') as likes_count,
         (SELECT COUNT(*) FROM post_interactions 
          WHERE post_id = p.id AND interaction_type = 'dislike') as dislikes_count
       FROM doctor_posts p
       JOIN doctors d ON p.doctor_id = d.id
       JOIN users u ON d.user_id = u.id
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [parseInt(limit), parseInt(offset)]
    );

    // الحصول على العدد الإجمالي
    const [total] = await db.query('SELECT COUNT(*) as total FROM doctor_posts');

    res.json({
      status: 'success',
      data: {
        posts: posts.map(post => ({
          ...post,
          doctor_name: post.doctor_name,
          doctor_specialty: post.doctor_specialty,
          doctor_profile_picture: post.doctor_profile_picture,
          likes_count: post.likes_count || 0,
          dislikes_count: post.dislikes_count || 0
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: total[0].total,
          totalPages: Math.ceil(total[0].total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Fetch Posts Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'فشل في جلب المنشورات',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};/**
 * إنشاء منشور جديد
 */
export const createDoctorPost = async (req, res) => {
  try {
    const { doctor_id, title, content, featured_image } = req.body;

    // تحقق من الحقول المطلوبة
    if (!doctor_id || !title || !content) {
      return res.status(400).json({
        status: 'error',
        message: 'doctor_id و title و content مطلوبة'
      });
    }

    // البحث عن doctor_id من user_id
    const [doctor] = await db.query(
      'SELECT id FROM doctors WHERE user_id = ?',
      [doctor_id]
    );

    if (doctor.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'لم يتم العثور على بيانات الطبيب'
      });
    }

    const actualDoctorId = doctor[0].id;

    // توليد post_url فريد
    const slugify = str => str.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    const post_url = slugify(title) + '-' + Date.now();

    const [result] = await db.query(
      `INSERT INTO doctor_posts (doctor_id, title, content, featured_image, post_url) VALUES (?, ?, ?, ?, ?)`,
      [actualDoctorId, title, content, featured_image || null, post_url]
    );

    res.status(201).json({
      status: 'success',
      message: 'تم إنشاء المنشور بنجاح',
      postId: result.insertId
    });
  } catch (error) {
    console.error('Create Post Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'فشل في إنشاء المنشور',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

export const getDoctorPostsById = async (req, res) => {
  const { id } = req.params; // استخراج doctor_id من URL
  const { limit = 10, offset = 0 } = req.query; // معالجة القيم المتغيرة

  try {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    // استعلام الحصول على المنشورات حسب doctor_id
    const [posts] = await connection.query(
      `SELECT 
         p.*, 
         u.name AS doctor_name,
         u.profile_picture AS doctor_profile_picture,
         d.specialization AS doctor_specialty,
         (SELECT COUNT(*) FROM post_interactions 
          WHERE post_id = p.id AND interaction_type = 'like') as likes_count,
         (SELECT COUNT(*) FROM post_interactions 
          WHERE post_id = p.id AND interaction_type = 'dislike') as dislikes_count
       FROM doctor_posts p
       JOIN doctors d ON p.doctor_id = d.id
       JOIN users u ON d.user_id = u.id
       WHERE p.doctor_id = ?
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [id, parseInt(limit), parseInt(offset)]
    );

    // استعلام الحصول على العدد الإجمالي للمنشورات
    const [total] = await connection.query(
      `SELECT COUNT(*) as total FROM doctor_posts WHERE doctor_id = ?`,
      [id]
    );

    await connection.commit();
    connection.release();

    res.json({
      status: "success",
      data: {
        posts: posts.map((post) => ({
          ...post,
          doctor_name: post.doctor_name,
          doctor_specialty: post.doctor_specialty,
          doctor_profile_picture: post.doctor_profile_picture,
          likes_count: post.likes_count || 0,
          dislikes_count: post.dislikes_count || 0,
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: total[0].total,
          totalPages: Math.ceil(total[0].total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error("Get Posts by Doctor Error:", error);
    res.status(500).json({
      status: "error",
      message: "فشل في جلب المنشورات",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
};