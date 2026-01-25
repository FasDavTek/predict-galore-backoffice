// src/app/error.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  // Chip,
  Alert,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InfoIcon from '@mui/icons-material/Info';
// import BugReportIcon from "@mui/icons-material/BugReport";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import HomeIcon from '@mui/icons-material/Home';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { createLogger } from '@/shared/api';

const logger = createLogger('ErrorBoundary');

/**
 * Global Error Boundary (app/error.tsx)
 * Provides user-friendly fallback UI and developer debugging info.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Generate random positions once using useState lazy initializer
  const [shapePositions] = useState(() => 
    [...Array(8)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }))
  );

  // ✅ Log error to logger
  useEffect(() => {
    logger.error('Application error caught by GlobalError Boundary', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    });
  }, [error]);

  const handleReset = async () => {
    setIsRetrying(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Smooth delay
    reset();
    setIsRetrying(false);
  };

  return (
    <Box className="flex items-center justify-center min-h-screen bg-linear-to-br from-red-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-red-900 px-4 relative overflow-hidden">
      {/* Background Animated Elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Floating error indicators */}
        {shapePositions.map((position, i) => (
          <motion.div
            key={i}
            className="absolute w-6 h-6 border-2 border-red-200 dark:border-red-800 rounded-full"
            style={{
              left: position.left,
              top: position.top,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.6,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl rounded-3xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-500/5 rounded-full translate-y-12 -translate-x-12" />

          <CardContent className="flex flex-col items-center justify-center space-y-6 py-12 px-8 relative z-10">
            {/* Animated Error Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.1,
              }}
              className="relative"
            >
              <div className="relative">
                <ErrorOutlineIcon
                  sx={{
                    fontSize: 80,
                    color: 'error.main',
                    filter: 'drop-shadow(0 4px 8px rgba(239, 68, 68, 0.3))',
                  }}
                />
                <motion.div
                  className="absolute inset-0 bg-red-500 rounded-full blur-md opacity-30"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* Error Status Chip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* <Chip
                label="Application Error"
                color="error"
                variant="filled"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  px: 2,
                  py: 1
                }}
              /> */}
            </motion.div>

            {/* Main Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center space-y-3"
            >
              <Typography
                variant="h4"
                className="font-bold text-gray-800 dark:text-white font-['Ultra']"
              >
                Unexpected Interruption
              </Typography>

              <Typography
                variant="body1"
                className="text-gray-600 dark:text-gray-300 max-w-md leading-relaxed"
              >
                We&apos;ve encountered a technical error while loading this page. Our team has been
                notified and is working on the fix.
              </Typography>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={
                  <motion.div
                    animate={{ rotate: isRetrying ? 360 : 0 }}
                    transition={{ duration: 1, repeat: isRetrying ? Infinity : 0 }}
                  >
                    <RestartAltIcon />
                  </motion.div>
                }
                onClick={handleReset}
                disabled={isRetrying}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  minWidth: 160,
                  boxShadow: '0 4px 15px rgba(22, 163, 74, 0.3)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(22, 163, 74, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {isRetrying ? 'Retrying...' : 'Try Again'}
              </Button>

              <Link href="/" passHref>
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<HomeIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    minWidth: 160,
                    borderWidth: 2,
                    color: 'text.primary',
                    borderColor: 'grey.400',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      borderWidth: 2,
                      backgroundColor: 'grey.100',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Go Home
                </Button>
              </Link>
            </motion.div>

            {/* Support Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-2 pt-4"
            >
              <Tooltip title="View technical details">
                <IconButton
                  onClick={() => setShowDetails(!showDetails)}
                  color="primary"
                  size="medium"
                  sx={{
                    border: 1,
                    borderColor: 'grey.300',
                    '&:hover': { backgroundColor: 'primary.50' },
                  }}
                >
                  {showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  <Typography variant="caption" sx={{ ml: 1, fontWeight: 'medium' }}>
                    Details
                  </Typography>
                </IconButton>
              </Tooltip>

              {/* <Tooltip title="Report this issue">
                <IconButton
                  color="error"
                  size="medium"
                  onClick={() =>
                    window.open(
                      "mailto:support@predictgalore.com?subject=Bug Report - " + 
                      encodeURIComponent(error.message.substring(0, 50)) + 
                      "&body=" + encodeURIComponent(
                        `Error Details:\n\nMessage: ${error.message}\n\n` +
                        `Page: ${window.location.href}\n\n` +
                        `Please describe what you were doing when this error occurred:`
                      )
                    )
                  }
                  sx={{
                    border: 1,
                    borderColor: 'grey.300',
                    '&:hover': { backgroundColor: 'error.50' }
                  }}
                >
                  <BugReportIcon />
                  <Typography variant="caption" sx={{ ml: 1, fontWeight: 'medium' }}>
                    Report
                  </Typography>
                </IconButton>
              </Tooltip> */}
            </motion.div>

            {/* Error Details - Collapsible */}
            <AnimatePresence>
              {showDetails && process.env.NODE_ENV === 'development' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <Alert severity="info" className="mt-4 rounded-xl border" icon={<InfoIcon />}>
                    <Typography variant="subtitle2" gutterBottom>
                      Developer Information
                    </Typography>
                    <Box className="mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto">
                      <Typography
                        variant="caption"
                        className="font-mono text-xs whitespace-pre-wrap wrap-break-word"
                        component="pre"
                      >
                        <strong>Message:</strong> {error.message}
                        {'\n\n'}
                        <strong>Stack Trace:</strong>
                        {'\n'}
                        {error.stack || 'No stack trace available.'}
                        {error.digest && `\n\nDigest: ${error.digest}`}
                      </Typography>
                    </Box>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Brand Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="pt-6"
            >
              <Link
                href="/"
                className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
              >
                <Image
                  src="/predict-galore-logo.png"
                  alt="Predict Galore"
                  width={120}
                  height={30}
                />
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Background Glow Effects */}
      <motion.div
        className="absolute top-1/3 -left-20 w-48 h-48 bg-red-200 dark:bg-red-900 rounded-full blur-3xl opacity-20"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-1/3 -right-20 w-48 h-48 bg-green-200 dark:bg-green-900 rounded-full blur-3xl opacity-20"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2.5,
        }}
      />
    </Box>
  );
}
