// context/AuthContext.js
import { createContext, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { isPublicRoute } from '@/config/routes';
import { selectCurrentUser } from '@/store/slices/authSlice';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const router = useRouter();
    
  const user = useSelector(selectCurrentUser);
  
  if (isPublicRoute(router.pathname)) {
    return <>{children}</>;
  }
  
  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};