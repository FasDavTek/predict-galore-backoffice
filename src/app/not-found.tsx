'use client';

import { Box, Button, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface Position {
  left: string;
  top: string;
}

export default function NotFound() {
  // Generate random positions once using useState lazy initializer
  const [shapePositions] = useState<Position[]>(() => 
    [...Array(12)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }))
  );

  // Use client-generated positions
  const positions = shapePositions;

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900 px-4 text-center space-y-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Floating shapes */}
        {positions.map((position, i) => (
          <motion.div
            key={i}
            className="absolute w-8 h-8 border-2 border-green-200 dark:border-green-800 rounded-full"
            style={position}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center space-y-6 relative z-10"
      >
        {/* Animated Number 404 */}
        <motion.div
          className="relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Typography
            variant="h1"
            className="font-bold text-gray-800 dark:text-white text-9xl md:text-[12rem] font-['Ultra'] tracking-tight"
          >
            404
          </Typography>

          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-green-500 to-blue-500 blur-xl opacity-20 -z-10"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Sports Icon Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex items-center justify-center space-x-4"
        >
          <motion.div
            animate={{
              rotate: [0, 15, 0, -15, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <SportsScoreIcon
              sx={{
                fontSize: 60,
                color: 'primary.main',
              }}
            />
          </motion.div>

          <Typography
            variant="h4"
            className="font-bold text-gray-700 dark:text-gray-200 font-['Ultra']"
          >
            OOPS! GOAL MISSED
          </Typography>

          <motion.div
            animate={{
              rotate: [0, -15, 0, 15, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          >
            <SportsScoreIcon
              sx={{
                fontSize: 60,
                color: 'secondary.main',
              }}
            />
          </motion.div>
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-4 max-w-md"
        >
          <Typography variant="body1" className="text-gray-500 dark:text-gray-400 leading-relaxed">
            It looks like this page took an unexpected detour. The content you&apos;re looking for
            might have been moved, or you entered the wrong URL.
          </Typography>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 pt-4"
        >
          <Link href="/" passHref>
            <Button
              variant="contained"
              color="primary"
              startIcon={<HomeIcon />}
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(22, 163, 74, 0.3)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(22, 163, 74, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Back to Home
            </Button>
          </Link>

          <Button
            variant="outlined"
            color="secondary"
            startIcon={<ArrowBackIcon />}
            size="large"
            onClick={() => window.history.back()}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 'bold',
              fontSize: '1rem',
              borderWidth: 2,
              '&:hover': {
                transform: 'translateY(-2px)',
                borderWidth: 2,
              },
              transition: 'all 0.3s ease',
            }}
          >
            Go Back
          </Button>
        </motion.div>

        {/* Additional Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="pt-6"
        >
          <Typography variant="body2" className="text-gray-400 dark:text-gray-500">
            Need help?{' '}
            <Link
              href="/contact"
              className="text-green-600 dark:text-green-400 hover:underline font-medium"
            >
              Contact our support team
            </Link>
          </Typography>
        </motion.div>
      </motion.div>

      {/* Bottom Branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8"
      >
        {/* <Link href="/" className="flex items-center gap-3">
          <Image
            src="/predict-galore-logo.png"
            alt="Predict Galore"
            width={160}
            height={40}
            className="opacity-80 hover:opacity-100 transition-opacity"
          />
        </Link> */}
      </motion.div>

      {/* Animated Background Pattern */}
      <motion.div
        className="absolute top-1/4 -left-20 w-40 h-40 bg-green-200 dark:bg-green-800 rounded-full blur-3xl opacity-30"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-1/4 -right-20 w-40 h-40 bg-blue-200 dark:bg-blue-800 rounded-full blur-3xl opacity-30"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
      />
    </Box>
  );
}
