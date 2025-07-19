use balance;

CREATE TABLE post_interactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    interaction_type ENUM('like', 'dislike') NOT NULL,
    interacted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (post_id) REFERENCES doctor_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- منع التفاعل المكرر لنفس المستخدم على نفس المنشور
    UNIQUE KEY unique_interaction (post_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



ALTER TABLE doctor_posts 
    DROP COLUMN likes_count,
    DROP COLUMN dislike_count;
    
DELIMITER //
CREATE PROCEDURE UpdatePostInteraction(
    IN p_post_id INT,
    IN p_user_id INT,
    IN p_interaction_type ENUM('like', 'dislike')
)
BEGIN
    DECLARE old_interaction_type ENUM('like', 'dislike');
    
    START TRANSACTION;
    
    -- التحقق من التفاعل السابق
    SELECT interaction_type INTO old_interaction_type
    FROM post_interactions
    WHERE post_id = p_post_id AND user_id = p_user_id;
    
    -- تحديث أو إضافة التفاعل
    INSERT INTO post_interactions (post_id, user_id, interaction_type)
    VALUES (p_post_id, p_user_id, p_interaction_type)
    ON DUPLICATE KEY UPDATE 
        interaction_type = p_interaction_type,
        updated_at = CURRENT_TIMESTAMP;
    
    -- تحديث العدادات في الجدول الرئيسي
    IF old_interaction_type IS NOT NULL THEN
        UPDATE doctor_posts
        SET 
            likes_count = likes_count - (old_interaction_type = 'like'),
            dislike_count = dislike_count - (old_interaction_type = 'dislike')
        WHERE id = p_post_id;
    END IF;
    
    UPDATE doctor_posts
    SET 
        likes_count = likes_count + (p_interaction_type = 'like'),
        dislike_count = dislike_count + (p_interaction_type = 'dislike')
    WHERE id = p_post_id;
    
    COMMIT;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetPostInteractions(IN p_post_id INT)
BEGIN
    SELECT 
        p.id AS post_id,
        p.title,
        COUNT(CASE WHEN pi.interaction_type = 'like' THEN 1 END) AS total_likes,
        COUNT(CASE WHEN pi.interaction_type = 'dislike' THEN 1 END) AS total_dislikes,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'user_id', u.id,
                'username', u.name,
                'interaction_type', pi.interaction_type,
                'interacted_at', pi.interacted_at
            )
        ) AS interactions_details
    FROM doctor_posts p
    LEFT JOIN post_interactions pi ON p.id = pi.post_id
    LEFT JOIN users u ON pi.user_id = u.id
    WHERE p.id = p_post_id
    GROUP BY p.id;
END//
DELIMITER ;