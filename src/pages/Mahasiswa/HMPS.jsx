import React from 'react';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import { Users, MessageCircle, Play, Send, Globe, Heart, Target, Zap } from 'lucide-react';
import Button from '../../components/Button';

const HMPS = () => {
  const { t } = useTranslation('academic');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50 dark:bg-slate-950">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-6"
            >
              <Users size={18} />
              <span className="text-sm font-bold tracking-wide uppercase">{t('hmps.subtitle')}</span>
            </m.div>
            <m.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black mb-6 text-slate-900 dark:text-white"
            >
              {t('hmps.title')}
            </m.h1>
            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
            >
              {t('hmps.desc')}
            </m.p>
          </div>

          {/* Vision & Mission Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <m.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-6">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-black mb-4 dark:text-white">Visi & Misi</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('hmps.vision')}
              </p>
            </m.div>

            <m.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-6">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-black mb-4 dark:text-white">Nilai Inti</h3>
              <div className="flex flex-wrap gap-2">
                {['Kreatif', 'Kolaboratif', 'Islami', 'Inovatif'].map((val) => (
                  <span key={val} className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
                    {val}
                  </span>
                ))}
              </div>
            </m.div>
          </div>

          {/* Social Media CTA */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-[2.5rem] bg-slate-900 text-white text-center shadow-2xl relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-8 opacity-5">
              <Users size={200} />
            </div>
            <h2 className="text-3xl font-black mb-4 relative z-10">{t('hmps.social')}</h2>
            <p className="text-slate-400 mb-8 relative z-10 max-w-lg mx-auto">Pantau terus kegiatan seru dan informasi terbaru seputar mahasiswa PBA di platform kami.</p>
            
            <div className="flex justify-center gap-6 relative z-10">
              <a href="#" target="_blank" className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center hover:scale-110 transition-transform">
                <MessageCircle size={28} />
              </a>
              <a href="#" target="_blank" className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center hover:scale-110 transition-transform">
                <Play size={28} />
              </a>
              <a href="#" target="_blank" className="w-14 h-14 rounded-2xl bg-sky-500 flex items-center justify-center hover:scale-110 transition-transform">
                <Send size={28} />
              </a>
            </div>
          </m.div>
        </div>
      </div>
    </div>
  );
};

export default HMPS;
