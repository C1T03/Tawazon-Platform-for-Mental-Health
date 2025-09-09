import { useState, useEffect } from 'react';
import { useUser } from '../components/context/UserContext';

const useStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [doctorStatistics, setDoctorStatistics] = useState(null);
  const [patientStatistics, setPatientStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { accessToken, isAuthenticated } = useUser();

  const fetchData = async (endpoint) => {
    if (!isAuthenticated || !accessToken) {
      throw new Error('يجب تسجيل الدخول أولاً');
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/statistics${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('غير مصرح بالوصول - يجب تسجيل الدخول مرة أخرى');
        }
        if (response.status === 403) {
          throw new Error('لا تملك صلاحية عرض الإحصائيات');
        }
        if (response.status === 500) {
          throw new Error('خطأ في الخادم - تأكد من تشغيل قاعدة البيانات');
        }
        throw new Error(`خطأ في جلب الإحصائيات: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'فشل في جلب الإحصائيات');
      }
      
      return data.data;
    } catch (fetchError) {
      if (fetchError.name === 'TypeError' && fetchError.message.includes('fetch')) {
        throw new Error('لا يمكن الاتصال بالخادم - تأكد من تشغيل الخادم');
      }
      throw fetchError;
    }
  };

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // جلب جميع الإحصائيات بشكل متزامن مع معالجة الأخطاء
      const results = await Promise.allSettled([
        fetchData(''),
        fetchData('/doctors'),
        fetchData('/patients')
      ]);
      
      // معالجة النتائج
      if (results[0].status === 'fulfilled') {
        setStatistics(results[0].value);
      } else {
        console.error('General stats error:', results[0].reason);
        setStatistics(null);
      }
      
      if (results[1].status === 'fulfilled') {
        setDoctorStatistics(results[1].value);
      } else {
        console.error('Doctor stats error:', results[1].reason);
        setDoctorStatistics(null);
      }
      
      if (results[2].status === 'fulfilled') {
        setPatientStatistics(results[2].value);
      } else {
        console.error('Patient stats error:', results[2].reason);
        setPatientStatistics(null);
      }
      
      // إذا فشلت جميع الطلبات، اعرض رسالة خطأ
      if (results.every(result => result.status === 'rejected')) {
        setError(results[0].reason.message || 'فشل في جلب الإحصائيات');
      }
    } catch (err) {
      setError(err.message);
      console.error('Statistics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      fetchStatistics();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, accessToken]);

  return { 
    statistics, 
    doctorStatistics, 
    patientStatistics, 
    loading, 
    error, 
    refetch: fetchStatistics 
  };
};

export default useStatistics;