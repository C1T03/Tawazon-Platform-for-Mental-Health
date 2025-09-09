import { createContext, useContext, useState, useEffect } from 'react';

// 1. تصدير Context كتصدير اسمي
export const UserContext = createContext();

// 2. تصدير Provider
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // التحقق من localStorage عند التحميل
  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');
    const savedRefreshToken = localStorage.getItem('refreshToken');

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setAccessToken(savedToken);
        setRefreshToken(savedRefreshToken);
      } catch (error) {
        // إذا فشل parsing، امسح البيانات
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData, tokens) => {
    setUser(userData);
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const value = {
    user,
    accessToken,
    refreshToken,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isLoading
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// 3. تصدير useUser مع تعليق eslint
// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser يجب استخدامه داخل UserProvider');
  }
  return context;
};

// 4. تصدير افتراضي إضافي إذا لزم الأمر
export default UserContext;