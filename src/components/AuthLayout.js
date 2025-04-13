import React, { useEffect } from 'react';
import Head from 'next/head';
import { Box, Grid, CircularProgress, Typography } from '@mui/material';
import FeatureCard from '@/components/auth/FeatureCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuote } from '../store/slices/quoteSlice';

const AuthLayout = ({ children, title, features }) => {
  const dispatch = useDispatch();
  const { data: quote, loading: quoteLoading, error: quoteError, isFallback } = useSelector((state) => state.quote);

  useEffect(() => {
    dispatch(fetchQuote());
    const interval = setInterval(() => {
      dispatch(fetchQuote());
    }, 30000); // Update quote every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>{`${title} | Predict Galore Admin`}</title>
      </Head>
      <Grid container sx={{ height: '100vh', width: '100%', margin: 0, overflow: 'hidden' }}>
        {/* Left Panel */}
        <Grid
          item
          xs={false}
          md={6}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#162E08',
            color: 'white',
            padding: '48px 40px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Logo Section */}
          <Box sx={{ marginBottom: '60px' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Predict Galore
            </Typography>
          </Box>

          {/* Features Section */}
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            flex: 1,
            marginBottom: '32px'
          }}>
            {features && features.map((feature, index) => (
              <FeatureCard 
                key={index} 
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                iconSize={32}
              />
            ))}
          </Box>

          {/* Quote Section - Fixed at bottom */}
          <Box
            sx={{
              backgroundColor: '#ED1C24',
              color: 'white',
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              minHeight: '120px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            {quoteLoading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress size={24} color="inherit" />
              </Box>
            ) : quote ? (
              <>
                <Typography 
                  component="blockquote" 
                  sx={{
                    fontSize: { md: '1.5rem', lg: '1.75rem' },
                    fontFamily: 'Ultra, serif',
                    marginBottom: '8px',
                    lineHeight: 1.3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  &apos;{quote.text}&apos;
                </Typography>
                <Typography 
                  component="p" 
                  sx={{ 
                    fontStyle: 'italic',
                    fontSize: '0.9rem'
                  }}
                >
                  — {quote.author}
                </Typography>
              </>
            ) : quoteError ? (
              <Typography>
                Failed to load quotes. Will retry shortly...
              </Typography>
            ) : null}
          </Box>
        </Grid>

        {/* Right Panel */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper',
            padding: { xs: '24px', md: '40px' },
            overflowY: 'auto'
          }}
        >
          <Box sx={{ 
            width: '100%', 
            maxWidth: '420px',
            padding: { xs: '16px', md: '28px' },
            boxShadow: { xs: 'none', md: '0 4px 12px rgba(0, 0, 0, 0.1)' },
            borderRadius: '8px',
            backgroundColor: 'white'
          }}>
            {children}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default AuthLayout;