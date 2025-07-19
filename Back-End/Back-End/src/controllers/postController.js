import db from '../config/db.js';

export const interactPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { interactionType } = req.body;

    if (!['like', 'dislike'].includes(interactionType)) {
      return res.status(400).json({ error: 'نوع التفاعل غير صالح' });
    }

    await db.query('CALL UpdatePostInteraction(?, ?, ?)', 
      [postId, userId, interactionType]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'فشل في تحديث التفاعل',
      details: error.message
    });
  }
};

export const getPostInteractions = async (req, res) => {
  try {
    const [results] = await db.query('CALL GetPostInteractions(?)', [req.params.id]);
    const interactionData = results[0][0];
    
    res.json({
      totalLikes: interactionData.total_likes,
      totalDislikes: interactionData.total_dislikes,
      interactions: JSON.parse(interactionData.interactions_details)
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'فشل في جلب البيانات',
      details: error.message
    });
  }
};

export const getDoctorPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [posts] = await db.query(
      `SELECT * FROM doctor_posts
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    
    const postsWithInteractions = await Promise.all(
      posts.map(async post => {
        const [interactions] = await db.query(
          'SELECT * FROM post_interactions WHERE post_id = ?',
          [post.id]
        );
        return {
          ...post,
          likes: interactions.filter(i => i.interaction_type === 'like').length,
          dislikes: interactions.filter(i => i.interaction_type === 'dislike').length
        };
      })
    );

    res.json(postsWithInteractions);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).send('Error fetching data from database');
  }
};