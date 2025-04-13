import React, { useEffect } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { Description, People, AccountBalanceWallet } from "@mui/icons-material";
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuote } from '../store/slices/quoteSlice';

const features = [
  {
    icon: <Description sx={{ width: 32, height: 32, color: "grey.50" }} />,
    title: "Share Predictions & Insights",
    description:
      "Create, edit, and remove match predictions for different leagues and sports.",
  },
  {
    icon: <People sx={{ width: 32, height: 32, color: "grey.50" }} />,
    title: "Track Analytics & User Engagement",
    description:
      "Compare consultation fees upfront to access quality care that fits your budget.",
  },
  {
    icon: <AccountBalanceWallet sx={{ width: 32, height: 32, color: "grey.50" }} />,
    title: "Manage Subscriptions & Access Control",
    description: "Control subscription tiers, pricing, and access limits",
  },
];

const fallbackQuote = {
  text: "In football, the worst blindness is only seeing the ball.",
  author: "Nelson Rodrigues"
};

export const AuthLayout = ({ children, title, subtitle }) => {
  const dispatch = useDispatch();
  const { data: quote, loading: quoteLoading, error: quoteError } = useSelector((state) => state.quote);
  
  useEffect(() => {
    dispatch(fetchQuote());
    const interval = setInterval(() => {
      dispatch(fetchQuote());
    }, 10000); 

    return () => clearInterval(interval);
  }, [dispatch]);

  // Use fallback quote if there's an error
  const displayQuote = quoteError ? fallbackQuote : quote;
  
  if (quoteError) {
    console.error("Error fetching quote:", quoteError);
  }

  return (
    <Box sx={{ 
      display: 'flex',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      bgcolor: 'background.paper'
    }}>
      {/* Left sidebar */}
      <Box sx={{
        width: '40%',
        height: '100%',
        bgcolor: '#162E08',
        padding: 4,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Logo */}
        <Box
          component="img"
          src="/predict-galore-logo.png"
          alt="Predict galore logo"
          sx={{
            width: 208,
            height: 40,
            mb: 8
          }}
        />

        {/* Features list */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          flex: 1,
          mb: 4
        }}>
          {features.map((feature, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ width: 32, height: 32 }}>{feature.icon}</Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ color: 'grey.50', fontFamily: 'Outfit', fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'grey.50', fontFamily: 'Outfit' }}>
                  {feature.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Quote card */}
        <Card sx={{
          width: '100%',
          bgcolor: '#ED1C24',
          borderRadius: 2,
          border: 'none',
          pb: 4,
        }}>
          <CardContent sx={{ padding: 4,  }}>
            <Box component="img" src="/opening-quote.svg" alt="Quote mark" sx={{ width: 18, height: 14 }} />
            <Typography sx={{
              fontFamily: 'Ultra',
              color: 'white',
            //   fontSize: { xs: '2rem', md: '3rem' },
              my: 3,
            }}>
              {quoteLoading ? (
                "..." // Loading dots
              ) : (
                `'${displayQuote?.text || fallbackQuote.text}'`
              )}
            </Typography>
            <Box component="img" src="/closing-quote.svg" alt="Quote mark" sx={{ width: 18, height: 14 }} />
            <Typography sx={{ color: 'white', fontSize: '1.5rem', mt: 2 }}>
              {!quoteLoading && `— ${displayQuote?.author || fallbackQuote.author}`}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Right side */}
      <Box sx={{
        width: '60%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        overflow: 'auto'
      }}>
        <Card sx={{
          width: '100%',
          maxWidth: 456,
          borderRadius: 2,
          border: '1px solid #d9d9de'
        }}>
          <CardContent sx={{ padding: 3.5 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ 
                fontFamily: 'Inter',
                color: 'text.primary',
                mb: 1
              }}>
                {title}
              </Typography>
              <Typography variant="body1" sx={{
                fontFamily: 'Inter',
                color: 'text.secondary'
              }}>
                {subtitle}
              </Typography>
            </Box>
            {children}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};