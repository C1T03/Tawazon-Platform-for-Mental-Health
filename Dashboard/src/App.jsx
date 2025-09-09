import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from "./components/context/UserContext";
import Dashboard from "./components/Dashboard";
import Login from './components/Auth/Login';
import ErrorBoundary from './components/ErrorBoundary';
import { useUser } from './components/context/UserContext';
export default function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <Router>
          <Routes>
            {/* المسار الرئيسي - يتم توجيهه بناءً على حالة المستخدم */}
            <Route path="/" element={<Dashboard />} />
            
            {/* مسار تسجيل الدخول */}
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </UserProvider>
    </ErrorBoundary>
  );
}

// مكون لحماية المسارات
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useUser();
  
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        جاري التحميل...
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}