import React, { useState } from 'react';  
import AuthLayout from '../../components/auth/AuthLayout';  
import {  
  Button,  
  Typography,  
  Box,  
  CircularProgress,  
  Alert  
} from '@mui/material';  
import { FiMail, FiClock } from 'react-icons/fi';  
import Link from 'next/link';  
import { AUTH_FEATURES } from '../../utils/constants';
import { toast } from 'react-toastify';

const EmailVerificationPage = () => {  
  const [resending, setResending] = useState(false);

  // Handle resend verification email  
  const handleResend = async () => {  
    setResending(true);  
    try {  
      // Simulate API call  
      await new Promise(resolve => setTimeout(resolve, 1000));  
      toast.success('Verification email resent successfully!');  
    } catch (error) {  
      toast.error('Failed to resend verification email');  
    } finally {  
      setResending(false);  
    }  
  };

  return (  
    <AuthLayout title="Verify Your Email" features={AUTH_FEATURES.register}>
      <Box sx={{ textAlign: 'center' }}>  
        <Box sx={{  
          display: 'inline-flex',  
          alignItems: 'center',  
          justifyContent: 'center',  
          width: 48,  
          height: 48,  
          borderRadius: '50%',  
          bgcolor: 'primary.light',  
          color: 'primary.main',  
          mb: 3  
        }}>  
          <FiMail size={24} />  
        </Box>

        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 700 }}>  
          Verify your email address  
        </Typography>

        <Typography variant="body1" color="text.secondary" gutterBottom>  
          We&apos;ve sent a verification link to your email address.  
          Please check your inbox and click the link to verify your account.  
        </Typography>

        <Alert severity="info" sx={{ mt: 3, textAlign: 'left' }}>  
          <Box display="flex" alignItems="center">  
            <FiClock style={{ marginRight: 8 }} />  
            Verification link expires in 24 hours  
          </Box>  
        </Alert>

        <Button  
          variant="contained"  
          fullWidth  
          onClick={handleResend}  
          disabled={resending}  
          startIcon={resending ? <CircularProgress size={20} /> : null}  
          sx={{ mt: 4 }}  
        >  
          {resending ? 'Sending...' : 'Resend Verification Email'}  
        </Button>

        <Box sx={{ mt: 2 }}>
          <Link href="/login">  
            Back to login  
          </Link>  
        </Box>
      </Box>  
    </AuthLayout>  
  );  
};

export default EmailVerificationPage;