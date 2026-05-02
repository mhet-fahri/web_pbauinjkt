import React from 'react';
import { m } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className, hover = true, delay = 0 }) => {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
      className={twMerge(
        'bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm',
        hover && 'hover:shadow-xl hover:shadow-primary-500/10 transition-shadow',
        className
      )}
    >
      {children}
    </m.div>
  );
};

export default Card;
