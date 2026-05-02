import React from 'react';
import { m } from 'framer-motion';
import { CheckCircle2, Target, Award, Rocket, Briefcase, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Tujuan = () => {
  const { t } = useTranslation();

  const goals = [
    {
      id: 1,
      title: t('pages.tujuan.items.1.title'),
      desc: t('pages.tujuan.items.1.desc'),
      icon: CheckCircle2
    },
    {
      id: 2,
      title: t('pages.tujuan.items.2.title'),
      desc: t('pages.tujuan.items.2.desc'),
      icon: Lightbulb
    },
    {
      id: 3,
      title: t('pages.tujuan.items.3.title'),
      desc: t('pages.tujuan.items.3.desc'),
      icon: Rocket
    },
    {
      id: 4,
      title: t('pages.tujuan.items.4.title'),
      desc: t('pages.tujuan.items.4.desc'),
      icon: Briefcase
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      {/* Header Section */}
      <section className="pt-40 pb-16 bg-primary-600 relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/10 skew-x-12 translate-x-1/2" />
        <div className="container-custom relative z-10">
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-6 border border-white/30 uppercase tracking-widest">
              <Target size={12} />
              <span>{t('pages.tujuan.badge')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
              {t('pages.tujuan.title')} <span className="text-primary-200">{t('pages.tujuan.title_accent')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-50 font-medium leading-relaxed max-w-2xl">
              {t('pages.tujuan.subtitle')}
            </p>
          </m.div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {goals.map((goal, index) => (
              <m.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 hover:shadow-2xl hover:shadow-primary-500/10 hover:border-primary-500/50 transition-all flex gap-6"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                  <goal.icon size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary-600 font-bold text-lg">0{goal.id}</span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{goal.title}</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {goal.desc}
                  </p>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* Graduation Stats/CTA - Compact */}
      <section className="pb-20">
        <div className="container-custom">
          <div className="bg-slate-900 rounded-3xl p-12 text-center text-white relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-primary-600 opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
            <Award className="w-12 h-12 mx-auto mb-6 text-primary-500" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('pages.tujuan.footer_title')}</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              {t('pages.tujuan.footer_desc')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tujuan;
