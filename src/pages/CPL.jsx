import React from 'react';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import { BookOpen, Languages, Brain, Monitor, Search, Briefcase, Heart, Award, GraduationCap } from 'lucide-react';

const CPL = () => {
  const { t } = useTranslation(['academic', 'common']);

  const cplList = [
    {
      title: t('cpl.items.0.title'),
      desc: t('cpl.items.0.desc'),
      icon: Heart,
      color: "from-rose-500 to-pink-600"
    },
    {
      title: t('cpl.items.1.title'),
      desc: t('cpl.items.1.desc'),
      icon: Languages,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: t('cpl.items.2.title'),
      desc: t('cpl.items.2.desc'),
      icon: BookOpen,
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: t('cpl.items.3.title'),
      desc: t('cpl.items.3.desc'),
      icon: Brain,
      color: "from-purple-500 to-violet-600"
    },
    {
      title: t('cpl.items.4.title'),
      desc: t('cpl.items.4.desc'),
      icon: Monitor,
      color: "from-orange-500 to-amber-600"
    },
    {
      title: t('cpl.items.5.title'),
      desc: t('cpl.items.5.desc'),
      icon: Search,
      color: "from-cyan-500 to-sky-600"
    },
    {
      title: t('cpl.items.6.title'),
      desc: t('cpl.items.6.desc'),
      icon: Briefcase,
      color: "from-fuchsia-500 to-pink-600"
    }
  ];
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-sky-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Hero & CEFR Highlight Section */}
      <section className="relative pt-40 pb-20 container-custom z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <m.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 text-primary-600 dark:text-primary-400 text-xs font-bold mb-8 uppercase tracking-widest">
              <GraduationCap size={14} />
              {t('cpl.badge')}
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-8 text-slate-900 dark:text-white leading-[1.1] tracking-tight">
              {t('cpl.title')} <span className="gradient-text">{t('cpl.title_accent')}</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
              {t('cpl.subtitle')}
            </p>
          </m.div>

          <m.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-primary-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-primary-500/20 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 border border-white/30 backdrop-blur-sm mb-6">
                <Award size={32} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-widest border border-white/20 mb-4">
                {t('cpl.cefr_badge')}
              </div>
              <h2 className="text-2xl font-black mb-3">{t('cpl.cefr_title')}</h2>
              <p className="text-primary-50 leading-relaxed text-sm">
                {t('cpl.cefr_desc')}
              </p>
            </div>
          </m.div>
        </div>
      </section>

      {/* CPL Cards Grid */}
      <section className="pb-24 container-custom z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cplList.map((item, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className="group p-8 rounded-[2rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none hover:border-primary-500/30 transition-all duration-500 relative"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} p-3.5 text-white shadow-lg shadow-current/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                  <item.icon size={28} strokeWidth={2.5} />
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 tracking-widest uppercase">
                  CPL {index + 1}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white leading-tight">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </m.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CPL;
