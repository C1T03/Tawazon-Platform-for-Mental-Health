import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from "./components/context/UserContext";
import Dashboard from "./components/Dashboard";
import Login from './components/Auth/Login';
import { useUser } from './components/context/UserContext';
export default function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* المسار الرئيسي - يتم توجيهه بناءً على حالة المستخدم */}
          <Route path="/" element={
          <ProtectedRoute>
              <Dashboard />

          </ProtectedRoute>
            
          } />
          






          
          {/* مسار تسجيل الدخول */}
          <Route path="/login" element={<Login />} />
          
        
        </Routes>
      </Router>
    </UserProvider>
  );
}

// مكون لحماية المسارات
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useUser(); // استخدمنا الهوك الذي أنشأناه سابقاً
  
  if (!isAuthenticated) {
    // توجيه إلى صفحة تسجيل الدخول إذا لم يكن مسجلاً
    return <Navigate to="/login" replace />;
  }

  return children;
}