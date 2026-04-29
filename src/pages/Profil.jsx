import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

const Profil = () => {
  return (
    <div className="pt-32 pb-20 container-custom">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-black mb-6">Profil Program Studi</h1>
        <p className="text-slate-600 dark:text-slate-400">Halaman ini sedang dalam pengembangan.</p>
      </motion.div>
    </div>
  );
};

export default Profil;
