import { createContext, useContext, useState } from 'react';

// 1. تصدير Context كتصدير اسمي
export const UserContext = createContext();

// 2. تصدير Provider
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const login = (userData, tokens) => {
    setUser(userData);
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
    
    console.log("بيانات المستخدم المسجلة:", {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      age: userData.age,
      country: userData.country,
      bio: userData.bio,
      profile_picture: userData.profile_picture,
      accessToken: tokens.accessToken ? "*****" : "غير متوفر",
      refreshToken: tokens.refreshToken ? "*****" : "غير متوفر",
    });
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
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
    isAuthenticated: !!user
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