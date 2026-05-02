import React from 'react';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import { 
  GraduationCap, 
  ExternalLink, 
  Heart, 
  Target, 
  TrendingUp,
  BarChart3,
  Award,
  ArrowRight
} from 'lucide-react';

const TracerStudy = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen pt-32 pb-20 bg-white dark:bg-slate-950 overflow-hidden relative">
      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-emerald-500/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-bold mb-8"
          >
            <TrendingUp size={16} />
            <span>{t('pages.alumni.tracer.badge')}</span>
          </m.div>
          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 leading-tight"
          >
            {t('pages.alumni.tracer.title')} <span className="text-emerald-600">{t('pages.alumni.tracer.title_accent')}</span>
          </m.h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto">
            {t('pages.alumni.tracer.subtitle')}
          </p>
        </div>

        {/* Hero Form Card */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-10 md:p-20 text-white shadow-2xl relative overflow-hidden mb-20"
        >
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/30">
                <GraduationCap size={32} />
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">{t('pages.alumni.tracer.hero_title')}</h2>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                {t('pages.alumni.tracer.hero_desc')}
              </p>
              <a 
                href="https://docs.google.com/forms/d/1C0lmX5-F_8VHaZrw_iwnSiegwTmSru9Z3Oj9jVUF1Ts/viewform?edit_requested=true" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black shadow-xl hover:bg-emerald-500 transition-all group text-lg"
              >
                {t('pages.alumni.tracer.hero_cta')} <ExternalLink size={20} className="group-hover:rotate-12 transition-transform" />
              </a>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: t('pages.alumni.tracer.feature_1'), icon: BarChart3, color: "bg-blue-600" },
                { label: t('pages.alumni.tracer.feature_2'), icon: Target, color: "bg-indigo-600" },
                { label: t('pages.alumni.tracer.feature_3'), icon: Award, color: "bg-amber-600" },
                { label: t('pages.alumni.tracer.feature_4'), icon: Heart, color: "bg-rose-600" },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center">
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                    <item.icon size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Decorative background pattern */}
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
            <GraduationCap size={400} />
          </div>
        </m.div>

        {/* Benefits Section */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-black text-center mb-12 text-slate-900 dark:text-white">{t('pages.alumni.tracer.why_title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <h4 className="font-black text-emerald-600 mb-4 flex items-center gap-2">
                <ArrowRight size={20} /> {t('pages.alumni.tracer.reason_1_title')}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('pages.alumni.tracer.reason_1_desc')}
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <h4 className="font-black text-emerald-600 mb-4 flex items-center gap-2">
                <ArrowRight size={20} /> {t('pages.alumni.tracer.reason_2_title')}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {t('pages.alumni.tracer.reason_2_desc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TracerStudy;
