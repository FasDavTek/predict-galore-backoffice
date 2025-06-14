// context/AuthContext.js
import { createContext, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { isPublicRoute } from '@/config/routes';
import { selectCurrentUser } from '@/store/slices/authSlice';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const router = useRouter();
    
    const authData = useSelector(selectCurrentUser); // This should now include the token
  
    if (isPublicRoute(router.pathname)) {
        return <>{children}</>;
    }
  
    // Create the context value object
    const contextValue = {
        user: authData?.user || null,
        token: authData?.token || null,
        role: authData?.role || null,
        permissions: authData?.user?.permissions || null
    };
  
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};