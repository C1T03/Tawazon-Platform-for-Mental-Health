import db from '../config/db.js';

// إضافة مراجعة جديدة
export const addReview = async (req, res) => {
  try {
    const { user_id, review_text, rating } = req.body;

    if (!user_id || !rating) {
      return res.status(400).json({
        success: false,
        message: 'يجب توفير معرف المستخدم والتقييم'
      });
    }

    if (rating < 0 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'التقييم يجب أن يكون بين 0 و 5'
      });
    }

    const [result] = await db.query(
      'INSERT INTO user_reviews (user_id, review_text, rating) VALUES (?, ?, ?)',
      [user_id, review_text, rating]
    );

    res.status(201).json({
      success: true,
      message: 'تم إضافة المراجعة بنجاح',
      reviewId: result.insertId
    });

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إضافة المراجعة'
    });
  }
};

// جلب جميع المراجعات
export const getAllReviews = async (req, res) => {
  try {
    const [reviews] = await db.query(`
      SELECT 
        ur.id,
        ur.review_text,
        ur.rating,
        ur.created_at,
        ur.updated_at,
        u.name as user_name,
        u.profile_picture
      FROM user_reviews ur
      JOIN users u ON ur.user_id = u.id
      ORDER BY ur.created_at DESC
    `);

    res.json({
      success: true,
      reviews: reviews,
      count: reviews.length
    });

  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب المراجعات'
    });
  }
};

// جلب مراجعات مستخدم معين
export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    const [reviews] = await db.query(`
      SELECT 
        id,
        review_text,
        rating,
        created_at,
        updated_at
      FROM user_reviews 
      WHERE user_id = ?
      ORDER BY created_at DESC
    `, [userId]);

    res.json({
      success: true,
      reviews: reviews,
      count: reviews.length
    });

  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب مراجعات المستخدم'
    });
  }
};

// تحديث مراجعة
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { review_text, rating } = req.body;

    if (rating && (rating < 0 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'التقييم يجب أن يكون بين 0 و 5'
      });
    }

    // التحقق من وجود المراجعة
    const [existingReview] = await db.query('SELECT * FROM user_reviews WHERE id = ?', [reviewId]);
    
    if (existingReview.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المراجعة غير موجودة'
      });
    }

    // بناء استعلام التحديث
    const updates = [];
    const values = [];

    if (review_text !== undefined) {
      updates.push('review_text = ?');
      values.push(review_text);
    }

    if (rating !== undefined) {
      updates.push('rating = ?');
      values.push(rating);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'لا توجد بيانات للتحديث'
      });
    }

    values.push(reviewId);

    await db.query(
      `UPDATE user_reviews SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({
      success: true,
      message: 'تم تحديث المراجعة بنجاح'
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث المراجعة'
    });
  }
};

// حذف مراجعة
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // التحقق من وجود المراجعة
    const [existingReview] = await db.query('SELECT * FROM user_reviews WHERE id = ?', [reviewId]);
    
    if (existingReview.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المراجعة غير موجودة'
      });
    }

    await db.query('DELETE FROM user_reviews WHERE id = ?', [reviewId]);

    res.json({
      success: true,
      message: 'تم حذف المراجعة بنجاح'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف المراجعة'
    });
  }
};

// جلب إحصائيات المراجعات
export const getReviewsStats = async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star,
        COUNT(CASE WHEN rating = 0 THEN 1 END) as zero_star
      FROM user_reviews
    `);

    res.json({
      success: true,
      stats: {
        ...stats[0],
        average_rating: parseFloat(stats[0].average_rating || 0).toFixed(2)
      }
    });

  } catch (error) {
    console.error('Get reviews stats error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب إحصائيات المراجعات'
    });
  }
};