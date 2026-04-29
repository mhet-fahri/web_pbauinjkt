import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Search, 
  Award, 
  FileText, 
  BookOpen, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

const Mahasiswa = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen pt-32 pb-20 bg-white dark:bg-slate-950 overflow-hidden relative">
      {/* Decorative BG */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold mb-8"
          >
            <GraduationCap size={16} />
            <span>{t('pages.mahasiswa.badge')}</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 leading-[1.1]"
          >
            {t('pages.mahasiswa.title')} <span className="text-blue-600">{t('pages.mahasiswa.title_accent')}</span> {t('pages.mahasiswa.title_suffix')}
          </motion.h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('pages.mahasiswa.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {[
            {
              title: t('pages.mahasiswa.cards.directory.title'),
              desc: t('pages.mahasiswa.cards.directory.desc'),
              cta: t('pages.mahasiswa.cards.directory.cta'),
              link: "/mahasiswa/data",
              icon: Search,
              color: "bg-blue-600",
              text: "text-blue-600"
            },
            {
              title: t('pages.mahasiswa.cards.services.title'),
              desc: t('pages.mahasiswa.cards.services.desc'),
              cta: t('pages.mahasiswa.cards.services.cta'),
              link: "/mahasiswa/layanan",
              icon: FileText,
              color: "bg-indigo-600",
              text: "text-indigo-600"
            }
          ].map((item, i) => (
            <Link key={i} to={item.link}>
              <motion.div
                whileHover={{ y: -10 }}
                className="group p-10 rounded-[3rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 transition-all h-full flex flex-col"
              >
                <div className={`w-16 h-16 rounded-2xl ${item.color} text-white flex items-center justify-center mb-8 shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform`}>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[
            { title: t('pages.mahasiswa.features.scholarship.title'), icon: Award, desc: t('pages.mahasiswa.features.scholarship.desc') },
            { title: t('pages.mahasiswa.features.organization.title'), icon: Sparkles, desc: t('pages.mahasiswa.features.organization.desc') },
            { title: t('pages.mahasiswa.features.library.title'), icon: BookOpen, desc: t('pages.mahasiswa.features.library.desc') },
          ].map((feat, i) => (
            <div key={i} className="p-8 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 shrink-0">
                <feat.icon size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">{feat.title}</h4>
                <p className="text-sm text-slate-500">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mahasiswa;
