use balance;
INSERT INTO video_categories (name, description, icon) VALUES
('القلق والاكتئاب', 'فيديوهات تعليمية عن اضطرابات القلق والاكتئاب', 'anxiety-icon'),
('اضطرابات الشخصية', 'فيديوهات عن أنواع اضطرابات الشخصية وعلاجها', 'personality-icon'),
('الصحة النفسية للأطفال', 'فيديوهات متخصصة في مشاكل الأطفال النفسية', 'child-psychology-icon'),
('التعافي من الصدمات', 'فيديوهات تساعد في التعافي من الصدمات النفسية', 'trauma-icon'),
('مهارات التأقلم', 'فيديوهات تعليمية لتحسين مهارات التأقلم', 'coping-icon');

INSERT INTO music_categories (name, description) VALUES
('موسيقى الاسترخاء', 'موسيقى هادئة تساعد على الاسترخاء وتخفيف التوتر'),
('أصوات الطبيعة', 'أصوات طبيعية لتحسين المزاج وزيادة التركيز'),
('الموسيقى العلاجية', 'مقطوعات موسيقية معدة خصيصاً للعلاج النفسي'),
('التأمل الموجه', 'موسيقى مصاحبة لجلسات التأمل والاسترخاء'),
('تحسين النوم', 'موسيقى وأصوات تساعد على النوم العميق');


INSERT INTO article_categories (name, description, slug) VALUES
('الاضطرابات النفسية', 'مقالات عن أنواع الاضطرابات النفسية وأعراضها', 'psychological-disorders'),
('العلاجات الحديثة', 'أحدث الطرق العلاجية في مجال الطب النفسي', 'modern-treatments'),
('نصائح يومية', 'نصائح عملية لتحسين الصحة النفسية', 'daily-tips'),
('قصص تعافي', 'تجارب حقيقية لأشخاص تعافوا من اضطرابات نفسية', 'recovery-stories'),
('أبحاث ودراسات', 'أحدث الأبحاث في مجال الصحة النفسية', 'research-studies');

-- إضافة فئات فرعية
INSERT INTO article_categories (name, description, slug, parent_id) VALUES
('الاكتئاب', 'كل ما يتعلق باضطراب الاكتئاب', 'depression', 1),
('القلق', 'مقالات عن اضطرابات القلق بأنواعها', 'anxiety', 1),
('التعافي من الإدمان', 'طرق علاج الإدمان النفسي', 'addiction-recovery', 2);

INSERT INTO doctors (name, gender, date_of_birth, profile_image, certificate, title, specialization, sub_specialization, bio, experience_years, languages, rating, consultation_fee, available_days, working_hours, emergency_available, country, city, email, phone, verified) VALUES
('د. أحمد محمد', 'male', '1975-03-15', 'ahmed.jpg', 'PhD_Psychiatry', 'أستاذ دكتور', 'الطب النفسي للبالغين', 'الاكتئاب المقاوم للعلاج', 'أخصائي نفسي مع 20 عاماً من الخبرة في علاج الاكتئاب والقلق', 20, 'العربية, الإنجليزية', 4.8, 300.00, 'السبت,الأحد,الثلاثاء,الخميس', '09:00-15:00', TRUE, 'السعودية', 'الرياض', 'ahmed@example.com', '+966501234567', TRUE),
('د. سارة عبدالله', 'female', '1982-07-22', 'sara.jpg', 'MD_Psychiatry', 'استشارية', 'طب نفس الأطفال', 'التوحد, ADHD', 'متخصصة في تشخيص وعلاج اضطرابات الأطفال النفسية', 12, 'العربية, الفرنسية', 4.9, 350.00, 'الأحد,الاثنين,الأربعاء', '10:00-16:00', FALSE, 'السعودية', 'جدة', 'sara@example.com', '+966502345678', TRUE),
('د. خالد إبراهيم', 'male', '1970-11-30', 'khaled.jpg', 'Board_Certified', 'بروفيسور', 'الطب النفسي الشرعي', 'اضطرابات الشخصية', 'خبير في الطب النفسي الشرعي وتقييم الحالات القانونية', 25, 'العربية, الإنجليزية', 4.7, 400.00, 'السبت,الاثنين,الأربعاء', '08:00-14:00', TRUE, 'الإمارات', 'دبي', 'khaled@example.com', '+971501234567', TRUE);


INSERT INTO users (name, email, password, phone, age, gender, country, city, role, doctor_id, registration_date) VALUES
('محمد علي', 'mohamed@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+966503456789', 32, 'male', 'السعودية', 'الرياض', 'user', NULL, '2023-01-15 10:30:00'),
('نورة عبدالرحمن', 'nora@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+966504567890', 28, 'female', 'السعودية', 'جدة', 'user', NULL, '2023-02-20 14:45:00'),
('عبدالله سالم', 'abdullah@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+971504567890', 35, 'male', 'الإمارات', 'أبوظبي', 'user', NULL, '2023-03-10 09:15:00'),
('أخصائي نفسي', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+966505678901', NULL, NULL, 'السعودية', 'الرياض', 'admin', NULL, '2023-01-01 08:00:00');

-- تحديث بعض المستخدمين لربطهم بالأطباء
UPDATE users SET doctor_id = 1 WHERE email = 'mohamed@example.com';
UPDATE users SET doctor_id = 2 WHERE email = 'nora@example.com';

INSERT INTO patients (doctor_id, user_id, start_date, treatment_plan, relationship_type, last_session_date, next_session_date) VALUES
(1, 1, '2023-02-01', 'جلسات أسبوعية للعلاج المعرفي السلوكي', 'therapy', '2023-05-20', '2023-05-27'),
(2, 2, '2023-03-15', 'تقييم شامل ومتابعة شهرية', 'consultation', '2023-05-18', '2023-06-18'),
(1, 3, '2023-04-10', 'علاج دوائي مع جلسات تأهيلية', 'followup', '2023-05-15', '2023-06-15');


INSERT INTO doctor_posts (doctor_id, title, content , featured_image, likes_count, post_url) VALUES
(1, 'كيف تتغلب على نوبات القلق؟', 'محتوى المقال عن طرق التعامل مع نوبات القلق...', 'anxiety-article.jpg', 45, 'how-to-deal-with-anxiety'),
(2, 'علامات التوحد عند الأطفال', 'دليل شامل لمعرفة علامات التوحد المبكرة...', 'autism-signs.jpg',  32, 'autism-signs-in-children'),
(3, 'العلاج النفسي في الجرائم', 'دور الطب النفسي في تقييم الجناة...', 'forensic-psych.jpg', 28, 'psychiatry-in-crime'),
(1, 'تجربة مريض مع الاكتئاب', 'قصة تعافي مريض من الاكتئاب الحاد...',  'recovery-story.jpg',  56, 'depression-recovery-story'),
(2, 'نصائح لأهالي أطفال ADHD', 'كيفية التعامل مع الأطفال المصابين بفرط الحركة...', 'adhd-tips.jpg',  67, 'adhd-parenting-tips');

