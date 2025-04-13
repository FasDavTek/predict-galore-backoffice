import React from 'react';  
import AuthLayout from '../../components/AuthLayout';  
import {  
  Button,  
  Typography,  
  Box  
} from '@mui/material';  
import { FiCheckCircle } from 'react-icons/fi';  
import Link from 'next/link';  
import { AUTH_FEATURES } from '../../utils/constants';

const PasswordResetSuccessPage = () => {  
  return (  
    <AuthLayout title="Password Reset Success" features={AUTH_FEATURES.forgotPassword}>
      <Box sx={{ textAlign: 'center' }}>  
        <Box sx={{  
          display: 'inline-flex',  
          alignItems: 'center',  
          justifyContent: 'center',  
          width: 48,  
          height: 48,  
          borderRadius: '50%',  
          bgcolor: 'success.light',  
          color: 'success.main',  
          mb: 3  
        }}>  
          <FiCheckCircle size={24} />  
        </Box>

        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 700 }}>  
          Password reset successful!  
        </Typography>

        <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>  
          Your password has been successfully reset. You can now log in with your new password.  
        </Typography>

        <Link href="/auth/login" passHref>  
          <Button  
            variant="contained"  
            fullWidth  
            sx={{ py: 1.5 }}  
            component="a"
          >  
            Return to Login  
          </Button>  
        </Link>  
      </Box>  
    </AuthLayout>  
  );  
};

export default PasswordResetSuccessPage;