# دليل استخدام API المراجعات (user_reviews)

## نظرة عامة
هذا API يتيح التعامل مع جدول `user_reviews` في قاعدة البيانات، والذي يحتوي على مراجعات المستخدمين وتقييماتهم.

## هيكل الجدول
```sql
CREATE TABLE user_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    review_text TEXT,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 0 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
);
```

## المسارات المتاحة

### 1. إضافة مراجعة جديدة
**POST** `/api/reviews`

**Body:**
```json
{
  "user_id": 1,
  "review_text": "تطبيق رائع جداً",
  "rating": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم إضافة المراجعة بنجاح",
  "reviewId": 1
}
```

### 2. جلب جميع المراجعات
**GET** `/api/reviews`

**Response:**
```json
{
  "success": true,
  "reviews": [
    {
      "id": 1,
      "review_text": "تطبيق رائع جداً",
      "rating": 5,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z",
      "user_name": "أحمد محمد",
      "profile_picture": "/uploads/user1.jpg"
    }
  ],
  "count": 1
}
```

### 3. جلب مراجعات مستخدم معين
**GET** `/api/reviews/user/:userId`

**Response:**
```json
{
  "success": true,
  "reviews": [
    {
      "id": 1,
      "review_text": "تطبيق رائع جداً",
      "rating": 5,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

### 4. تحديث مراجعة
**PUT** `/api/reviews/:reviewId`

**Body:**
```json
{
  "review_text": "تطبيق ممتاز محدث",
  "rating": 4
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم تحديث المراجعة بنجاح"
}
```

### 5. حذف مراجعة
**DELETE** `/api/reviews/:reviewId`

**Response:**
```json
{
  "success": true,
  "message": "تم حذف المراجعة بنجاح"
}
```

### 6. جلب إحصائيات المراجعات
**GET** `/api/reviews/stats`

**Response:**
```json
{
  "success": true,
  "stats": {
    "total_reviews": 10,
    "average_rating": "4.20",
    "five_star": 3,
    "four_star": 4,
    "three_star": 2,
    "two_star": 1,
    "one_star": 0,
    "zero_star": 0
  }
}
```

## قواعد التحقق

### التقييم (rating)
- يجب أن يكون بين 0 و 5
- مطلوب في عملية الإضافة

### معرف المستخدم (user_id)
- مطلوب في عملية الإضافة
- يجب أن يكون موجود في جدول users

### نص المراجعة (review_text)
- اختياري
- يمكن أن يكون فارغ أو null

## أمثلة الاستخدام

### JavaScript/Fetch
```javascript
// إضافة مراجعة
const addReview = async () => {
  const response = await fetch('/api/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: 1,
      review_text: 'تطبيق رائع',
      rating: 5
    })
  });
  const data = await response.json();
  console.log(data);
};

// جلب المراجعات
const getReviews = async () => {
  const response = await fetch('/api/reviews');
  const data = await response.json();
  console.log(data.reviews);
};
```

### cURL
```bash
# إضافة مراجعة
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "review_text": "تطبيق رائع", "rating": 5}'

# جلب المراجعات
curl http://localhost:5000/api/reviews

# جلب إحصائيات
curl http://localhost:5000/api/reviews/stats
```

## اختبار API
لاختبار جميع العمليات، قم بتشغيل:
```bash
node test_reviews_api.js
```

## ملاحظات مهمة
1. تأكد من تشغيل الخادم على المنفذ 5000
2. تأكد من وجود جدول users مع بيانات صحيحة
3. جميع التواريخ يتم إنشاؤها تلقائياً
4. عند حذف مستخدم، ستحذف مراجعاته تلقائياً (CASCADE)
5. الفهارس موجودة لتحسين الأداء