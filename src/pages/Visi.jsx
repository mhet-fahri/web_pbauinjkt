import React from 'react';
import { m } from 'framer-motion';
import { Target, Zap, Layers, Microscope, Globe2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const Visi = () => {
  const { t } = useTranslation(['profile', 'common']);

  const pillars = [
    {
      title: t('visi.pillars.0.title'),
      desc: t('visi.pillars.0.desc'),
      icon: Zap,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: t('visi.pillars.1.title'),
      desc: t('visi.pillars.1.desc'),
      icon: Layers,
      color: "from-indigo-500 to-purple-500"
    },
    {
      title: t('visi.pillars.2.title'),
      desc: t('visi.pillars.2.desc'),
      icon: Microscope,
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: t('visi.pillars.3.title'),
      desc: t('visi.pillars.3.desc'),
      icon: Globe2,
      color: "from-orange-500 to-rose-500"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <SEO 
        title={t('visi.title')} 
        description={t('visi.main_visi')}
        url="/profil/visi"
      />
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-primary-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 container-custom z-10">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 text-primary-600 dark:text-primary-400 text-xs font-bold mb-8 uppercase tracking-widest">
            <Target size={14} />
            {t('visi.badge')}
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-10 text-slate-900 dark:text-white leading-[1.1] tracking-tight">
            {t('visi.title')} <br/>
            <span className="gradient-text">{t('visi.title_accent')}</span>
          </h1>
          
          <div className="relative p-10 rounded-[2.5rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary-600" />
            <p className="text-xl md:text-3xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
              "{t('visi.main_visi')}"
            </p>
          </div>
        </m.div>
      </section>

      {/* Pillars Section */}
      <section className="py-20 container-custom z-10">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-black mb-4 text-slate-900 dark:text-white">{t('visi.pillars_title')}</h2>
          <div className="w-24 h-2 bg-gradient-to-r from-primary-600 to-sky-600 rounded-full" />
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group p-10 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-primary-500/10 hover:border-primary-500/30 transition-all flex flex-col md:flex-row gap-8 items-start md:items-center"
            >
              <div className={`flex-shrink-0 w-20 h-20 rounded-[1.5rem] bg-gradient-to-br ${pillar.color} p-5 text-white shadow-lg shadow-current/20 group-hover:rotate-6 transition-transform duration-500`}>
                <pillar.icon size={40} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{pillar.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </m.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Visi;
