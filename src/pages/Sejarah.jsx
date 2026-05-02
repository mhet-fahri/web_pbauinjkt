import React from 'react';
import { m } from 'framer-motion';
import { Calendar, History, Award, BookOpen, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Sejarah = () => {
  const { t } = useTranslation(['profile', 'common']);

  const milestones = [
    {
      year: t('sejarah.milestones.0.year'),
      title: t('sejarah.milestones.0.title'),
      icon: History,
      desc: t('sejarah.milestones.0.desc')
    },
    {
      year: t('sejarah.milestones.1.year'),
      title: t('sejarah.milestones.1.title'),
      icon: Award,
      desc: t('sejarah.milestones.1.desc')
    },
    {
      year: t('sejarah.milestones.2.year'),
      title: t('sejarah.milestones.2.title'),
      icon: GraduationCap,
      desc: t('sejarah.milestones.2.desc')
    },
    {
      year: t('sejarah.milestones.3.year'),
      title: t('sejarah.milestones.3.title'),
      icon: BookOpen,
      desc: t('sejarah.milestones.3.desc')
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section - More Compact */}
      <section className="relative pt-32 pb-12 overflow-hidden bg-slate-50 dark:bg-slate-900/50">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-100/50 dark:bg-primary-900/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>
        
        <div className="container-custom relative z-10">
          <m.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-bold mb-4 border border-primary-200 dark:border-primary-800 uppercase tracking-widest">
              <History size={12} />
              <span>{t('sejarah.badge')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight text-slate-900 dark:text-white">
              {t('sejarah.title')} <span className="gradient-text">{t('sejarah.title_accent')}</span>
            </h1>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
              {t('sejarah.desc')}
            </p>
          </m.div>
        </div>
      </section>

      {/* Grid Timeline Section - Much more compact */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {milestones.map((item, index) => (
              <m.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary-500/50 transition-all group flex gap-5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-primary-600 shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-all">
                  <item.icon size={20} />
                </div>
                <div>
                  <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider block mb-1">
                    {item.year}
                  </span>
                  <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {item.desc}
                  </p>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section - Integrated & Compact */}
      <section className="pb-20">
        <div className="container-custom">
          <div className="bg-primary-600 rounded-3xl p-8 text-center text-white shadow-xl shadow-primary-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <Award className="w-10 h-10 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl md:text-2xl font-bold italic max-w-2xl mx-auto">
              "{t('sejarah.quote')}"
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
};

// Utility for classes
const clsx = (...classes) => classes.filter(Boolean).join(' ');

export default Sejarah;
