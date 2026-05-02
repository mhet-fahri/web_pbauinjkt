import React from 'react';
import { m } from 'framer-motion';
import { GraduationCap, BookText, Cpu, Compass, Search, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProfilLulusan = () => {
  const { t } = useTranslation(['profile', 'common']);

  const profiles = [
    {
      title: t('profil_lulusan.profiles.0.title'),
      icon: GraduationCap,
      color: "from-blue-500 to-indigo-600",
      desc: t('profil_lulusan.profiles.0.desc')
    },
    {
      title: t('profil_lulusan.profiles.1.title'),
      icon: BookText,
      color: "from-emerald-500 to-teal-600",
      desc: t('profil_lulusan.profiles.1.desc')
    },
    {
      title: t('profil_lulusan.profiles.2.title'),
      icon: Cpu,
      color: "from-orange-500 to-amber-600",
      desc: t('profil_lulusan.profiles.2.desc')
    },
    {
      title: t('profil_lulusan.profiles.3.title'),
      icon: Compass,
      color: "from-purple-500 to-pink-600",
      desc: t('profil_lulusan.profiles.3.desc')
    },
    {
      title: t('profil_lulusan.profiles.4.title'),
      icon: Search,
      color: "from-rose-500 to-red-600",
      desc: t('profil_lulusan.profiles.4.desc')
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 container-custom z-10">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 text-primary-600 dark:text-primary-400 text-xs font-bold mb-8 uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            {t('profil_lulusan.badge')}
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 text-slate-900 dark:text-white leading-[1.1] tracking-tight">
            {t('profil_lulusan.title')} <span className="gradient-text">{t('profil_lulusan.title_accent')}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">
            {t('profil_lulusan.subtitle')}
          </p>
        </m.div>
      </section>

      {/* Profiles Grid */}
      <section className="pb-32 container-custom z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profiles.map((profile, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <div className="h-full p-10 rounded-[2.5rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none flex flex-col transition-all duration-500 hover:border-primary-500/30 overflow-hidden">
                {/* Decorative Gradient Background */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${profile.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 rounded-bl-[5rem]`} />
                
                {/* Icon with Vibrant Gradient */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${profile.color} p-4 text-white shadow-lg shadow-current/20 mb-8 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  <profile.icon size={32} strokeWidth={2.5} />
                </div>

                <h3 className="text-2xl font-black mb-4 text-slate-900 dark:text-white leading-tight">
                  {profile.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  {profile.desc}
                </p>

                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expertise Area</span>
                  <div className={`w-8 h-1 bg-gradient-to-r ${profile.color} rounded-full`} />
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </section>

      {/* Compact Stat Footer */}
      <section className="pb-24 container-custom z-10">
        <m.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden group shadow-3xl"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-600 to-sky-600 opacity-10" />
          <h2 className="text-3xl font-black mb-4">{t('profil_lulusan.footer_title')}</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-0">
            {t('profil_lulusan.footer_desc')}
          </p>
        </m.div>
      </section>
    </div>
  );
};

export default ProfilLulusan;
