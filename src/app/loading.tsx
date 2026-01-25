// src/app/loading.tsx
'use client';

import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

export default function Loading() {
  // Generate random positions once using useState lazy initializer
  const [floatingShapes] = useState<Array<{ left: string; top: string }>>(() => 
    [...Array(8)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }))
  );

  const shapes = floatingShapes;

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-green-900 text-center space-y-8">
      {/* Main Logo Container */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {/* Logo with multiple animation effects */}
        <motion.div
          className="relative"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 2, 0, -2, 0],
          }}
          transition={{
            y: {
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            rotate: {
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          <Image
            src="/predict-galore-logo.png"
            alt="Predict Galore"
            width={280}
            height={80}
            className="drop-shadow-2xl"
            priority
          />
        </motion.div>

        {/* Pulsing Ring Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-4 border-green-500 border-opacity-30"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: [0, 0.5, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-500 rounded-full"
            initial={{
              opacity: 0,
              scale: 0,
              x: 0,
              y: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: Math.cos((i * 60 * Math.PI) / 180) * 100,
              y: Math.sin((i * 60 * Math.PI) / 180) * 100,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
            style={{
              left: '50%',
              top: '50%',
              marginLeft: -4,
              marginTop: -4,
            }}
          />
        ))}
      </motion.div>

      {/* Loading Text with Typing Effect */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <Typography
          variant="h5"
          className="text-green-800 dark:text-green-300 font-bold tracking-tight"
          component="div"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {'Predicting Excellence'.split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.8 }}
              >
                {char}
              </motion.span>
            ))}
          </motion.span>
        </Typography>

        {/* Animated Progress Bar */}
        <motion.div
          className="w-64 h-2 bg-green-200 dark:bg-green-800 rounded-full overflow-hidden"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.div
            className="h-full bg-linear-to-r from-green-500 to-green-600 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              repeatType: 'reverse',
            }}
          />
        </motion.div>

        {/* Subtle Loading Text */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          <Typography
            variant="body2"
            className="text-green-600 dark:text-green-400 font-medium tracking-wide"
          >
            Preparing your experience...
          </Typography>
        </motion.div>
      </motion.div>

      {/* Background Decorative Elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Floating shapes */}
        {shapes.map((position, i) => (
          <motion.div
            key={i}
            className="absolute w-6 h-6 border-2 border-green-300 dark:border-green-700 rounded-full"
            style={position}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>

      {/* Debug timer display (optional) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm"
      >
        Loading... (30s simulation)
      </motion.div>
    </Box>
  );
}
