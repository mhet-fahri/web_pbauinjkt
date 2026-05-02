import React from 'react';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import { 
  BookOpen, 
  Target, 
  Cpu, 
  Globe, 
  Award, 
  Zap, 
  Users, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Search
} from 'lucide-react';
import Card from '../components/Card';

const Kurikulum = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white dark:bg-slate-950 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container-custom relative z-10">
        {/* Hero Section */}
        <div className="max-w-4xl mb-24">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-bold mb-8"
          >
            <Sparkles size={16} />
            <span>{t('pages.curriculum.badge')}</span>
          </m.div>
          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 leading-[1.1]"
          >
            {t('pages.curriculum.title')} <span className="gradient-text">{t('pages.curriculum.title_accent')}</span>
          </m.h1>
          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed"
          >
            {t('pages.curriculum.subtitle')}
          </m.p>
        </div>

        {/* Feature Cards / Pilars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          <m.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group p-10 rounded-[3rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-primary-500/30 transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary-600 text-white flex items-center justify-center mb-8 shadow-lg shadow-primary-600/20 group-hover:scale-110 transition-transform">
              <Cpu size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">{t('pages.curriculum.digital_era.title')}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('pages.curriculum.digital_era.desc')}
            </p>
          </m.div>

          <m.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group p-10 rounded-[3rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white text-slate-900 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Target size={32} />
              </div>
              <h3 className="text-2xl font-black mb-6">{t('pages.curriculum.holistic_vision.title')}</h3>
              <p className="text-slate-300 leading-relaxed">
                {t('pages.curriculum.holistic_vision.desc')}
              </p>
            </div>
            <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-1/4 -translate-y-1/4">
              <Sparkles size={250} />
            </div>
          </m.div>
        </div>

        {/* OBE Section */}
        <div className="bg-gradient-to-br from-indigo-600 to-primary-700 rounded-[4rem] p-12 md:p-20 text-white mb-32 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">{t('pages.curriculum.obe.title')}</h2>
              <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
                {t('pages.curriculum.obe.desc')}
              </p>
              <div className="space-y-4">
                {(t('pages.curriculum.obe.points', { returnObjects: true }) || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-emerald-400" size={24} />
                    <span className="font-bold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: t('pages.curriculum.obe.roles.educator'), icon: Users },
                { label: t('pages.curriculum.obe.roles.researcher'), icon: Search },
                { label: t('pages.curriculum.obe.roles.developer'), icon: Cpu },
                { label: t('pages.curriculum.obe.roles.entrepreneur'), icon: Zap },
              ].map((prof, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl text-center">
                  <prof.icon className="mx-auto mb-4" size={32} />
                  <div className="font-black text-sm uppercase tracking-widest">{prof.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Closing Quote / Identity */}
        <div className="max-w-3xl mx-auto text-center">
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 rounded-[3.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <BookOpen size={48} className="mx-auto text-primary-600 mb-8" />
            <p className="text-2xl font-bold text-slate-900 dark:text-white leading-relaxed italic mb-8">
              "{t('pages.curriculum.quote')}"
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {(t('pages.curriculum.tags', { returnObjects: true }) || []).map((tag, i) => (
                <div key={i} className="px-6 py-2 bg-white dark:bg-slate-800 rounded-full text-xs font-black uppercase tracking-widest text-slate-500 border border-slate-200 dark:border-slate-700">
                  {tag}
                </div>
              ))}
            </div>
          </m.div>
        </div>
      </div>
    </div>
  );
};

export default Kurikulum;
