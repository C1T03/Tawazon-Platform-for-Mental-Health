// اختبار API المراجعات
// تشغيل هذا الملف باستخدام: node test_reviews_api.js

const BASE_URL = 'http://localhost:5000/api/reviews';

// دالة لإرسال طلبات HTTP
async function makeRequest(url, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(`${method} ${url}:`, result);
    return result;
  } catch (error) {
    console.error(`خطأ في ${method} ${url}:`, error.message);
  }
}

// اختبار جميع العمليات
async function testReviewsAPI() {
  console.log('🧪 بدء اختبار API المراجعات...\n');

  // 1. إضافة مراجعة جديدة
  console.log('1️⃣ إضافة مراجعة جديدة:');
  const newReview = await makeRequest(BASE_URL, 'POST', {
    user_id: 1,
    review_text: 'تطبيق رائع جداً، ساعدني كثيراً في تحسين صحتي النفسية',
    rating: 5
  });

  // 2. إضافة مراجعة أخرى
  console.log('\n2️⃣ إضافة مراجعة أخرى:');
  await makeRequest(BASE_URL, 'POST', {
    user_id: 2,
    review_text: 'تطبيق جيد لكن يحتاج بعض التحسينات',
    rating: 3
  });

  // 3. جلب جميع المراجعات
  console.log('\n3️⃣ جلب جميع المراجعات:');
  await makeRequest(BASE_URL);

  // 4. جلب مراجعات مستخدم معين
  console.log('\n4️⃣ جلب مراجعات المستخدم رقم 1:');
  await makeRequest(`${BASE_URL}/user/1`);

  // 5. جلب إحصائيات المراجعات
  console.log('\n5️⃣ جلب إحصائيات المراجعات:');
  await makeRequest(`${BASE_URL}/stats`);

  // 6. تحديث مراجعة (إذا تم إنشاؤها بنجاح)
  if (newReview && newReview.success && newReview.reviewId) {
    console.log('\n6️⃣ تحديث المراجعة:');
    await makeRequest(`${BASE_URL}/${newReview.reviewId}`, 'PUT', {
      review_text: 'تطبيق ممتاز! محدث: أصبح أفضل مع التحديثات الجديدة',
      rating: 5
    });
  }

  // 7. حذف مراجعة (إذا تم إنشاؤها بنجاح)
  if (newReview && newReview.success && newReview.reviewId) {
    console.log('\n7️⃣ حذف المراجعة:');
    await makeRequest(`${BASE_URL}/${newReview.reviewId}`, 'DELETE');
  }

  console.log('\n✅ انتهى اختبار API المراجعات');
}

// تشغيل الاختبارات
testReviewsAPI();