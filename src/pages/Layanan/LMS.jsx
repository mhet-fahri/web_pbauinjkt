import React from 'react';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import { Monitor, BookOpen, Clock, Users, ArrowRight, CheckCircle, Globe } from 'lucide-react';
import Button from '../../components/Button';

const LMS = () => {
  const { t } = useTranslation('academic');

  const features = t('lms.features', { returnObjects: true });

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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-6"
            >
              <Monitor size={18} />
              <span className="text-sm font-bold tracking-wide uppercase">{t('lms.subtitle')}</span>
            </m.div>
            <m.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black mb-6 text-slate-900 dark:text-white"
            >
              {t('lms.title')}
            </m.h1>
            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
            >
              {t('lms.desc')}
            </m.p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <m.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Fitur Utama LMS</h2>
              <div className="grid grid-cols-1 gap-4">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={18} />
                    </div>
                    <p className="font-medium text-slate-700 dark:text-slate-300">{feature}</p>
                  </div>
                ))}
              </div>
            </m.div>

            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-[2rem] bg-indigo-600 p-8 flex flex-col justify-center items-center text-center text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-primary-700 opacity-50" />
                <Monitor size={80} className="mb-6 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                <h3 className="text-2xl font-black mb-4 relative z-10">Moodle Platform</h3>
                <p className="text-indigo-100 relative z-10 mb-8">Standar platform e-learning kelas dunia.</p>
                <a href="https://lms.uinjkt.ac.id/" target="_blank" rel="noopener noreferrer" className="relative z-10 w-full">
                  <Button size="lg" className="w-full bg-white text-indigo-600 hover:bg-indigo-50">
                    {t('lms.cta')} <ArrowRight className="ml-2" size={18} />
                  </Button>
                </a>
              </div>
            </m.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LMS;
