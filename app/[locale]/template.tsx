'use client';

import { motion } from 'framer-motion';
import { type ReactElement } from 'react';

export default function Template({ children }: { children: React.ReactNode }): ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ ease: 'easeOut', duration: 0.4 }}
      className="min-h-screen w-full"
    >
      {children}
    </motion.div>
  );
}
