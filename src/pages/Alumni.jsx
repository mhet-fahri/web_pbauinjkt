import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  ArrowRight, 
  Search, 
  Briefcase, 
  CheckCircle2,
  Sparkles,
  Globe
} from 'lucide-react';

const Alumni = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen pt-32 pb-20 bg-white dark:bg-slate-950 overflow-hidden relative">
      {/* Decorative BG */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-bold mb-8"
          >
            <Users size={16} />
            <span>{t('pages.alumni.badge')}</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 leading-[1.1]"
          >
            {t('pages.alumni.title')} <span className="text-emerald-600">{t('pages.alumni.title_accent')}</span> {t('pages.alumni.title_suffix')}
          </motion.h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('pages.alumni.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {[
            {
              title: t('pages.alumni.cards.directory.title'),
              desc: t('pages.alumni.cards.directory.desc'),
              cta: t('pages.alumni.cards.directory.cta'),
              link: "/alumni/data",
              icon: Search,
              color: "bg-blue-600",
              light: "bg-blue-50 dark:bg-blue-900/20",
              text: "text-blue-600"
            },
            {
              title: t('pages.alumni.cards.tracer.title'),
              desc: t('pages.alumni.cards.tracer.desc'),
              cta: t('pages.alumni.cards.tracer.cta'),
              link: "/alumni/tracer-study",
              icon: GraduationCap,
              color: "bg-emerald-600",
              light: "bg-emerald-50 dark:bg-emerald-900/20",
              text: "text-emerald-600"
            }
          ].map((item, i) => (
            <Link key={i} to={item.link}>
              <motion.div
                whileHover={{ y: -10 }}
                className="group p-10 rounded-[3rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 transition-all h-full flex flex-col"
              >
                <div className={`w-16 h-16 rounded-2xl ${item.color} text-white flex items-center justify-center mb-8 shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform`}>
                  <item.icon size={32} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-10 flex-grow">
                  {item.desc}
                </p>
                <div className={`flex items-center gap-2 font-black uppercase tracking-widest text-xs ${item.text}`}>
                  {item.cta} <ArrowRight size={16} />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="bg-slate-900 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <h2 className="text-4xl font-black mb-8 leading-tight">{t('pages.alumni.contribution.title')}</h2>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                {t('pages.alumni.contribution.desc')}
              </p>
              <div className="space-y-6">
                {t('pages.alumni.contribution.points', { returnObjects: true }).map((text, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                    <span className="font-bold text-slate-200">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="h-40 rounded-3xl bg-emerald-600 flex flex-col items-center justify-center text-center p-4">
                    <Briefcase size={32} className="mb-2" />
                    <div className="text-2xl font-black">85%</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">{t('pages.alumni.contribution.stats.employment')}</div>
                  </div>
                  <div className="h-32 rounded-3xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-center p-4">
                    <Globe size={32} className="mb-2" />
                    <div className="text-xl font-black">Global</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">{t('pages.alumni.contribution.stats.reach')}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-32 rounded-3xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-center p-4">
                    <Sparkles size={32} className="mb-2" />
                    <div className="text-xl font-black">Inspiratif</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">{t('pages.alumni.contribution.stats.story')}</div>
                  </div>
                  <div className="h-40 rounded-3xl bg-white text-slate-900 flex flex-col items-center justify-center text-center p-4 shadow-xl">
                    <Users size={32} className="mb-2 text-emerald-600" />
                    <div className="text-2xl font-black">1000+</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('pages.alumni.contribution.stats.graduates')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alumni;
