import axios from 'axios';

const testLogin = async () => {
  try {
    console.log('اختبار API تسجيل الدخول...\n');

    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'shazaAlsokhny@gmail.com',
      password: 'shaza123' // استخدم كلمة المرور الصحيحة
    });

    if (response.data.success) {
      console.log('✅ تم تسجيل الدخول بنجاح!');
      console.log('\n=== بيانات المستخدم المُرجعة ===');
      console.log('User ID:', response.data.user.id);
      console.log('Name:', response.data.user.name);
      console.log('Role:', response.data.user.role);
      console.log('Doctor ID:', response.data.user.doctorId);
      console.log('Doctor ID Type:', typeof response.data.user.doctorId);
      
      console.log('\n=== البيانات الكاملة ===');
      console.log(JSON.stringify(response.data.user, null, 2));
    } else {
      console.log('❌ فشل تسجيل الدخول:', response.data.message);
    }

  } catch (error) {
    console.error('خطأ في الاتصال:', error.response?.data || error.message);
  }
};

testLogin();