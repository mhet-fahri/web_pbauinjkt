import React from 'react';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import { Award, ShieldCheck, Globe, Download, FileText, ExternalLink, CheckCircle2 } from 'lucide-react';

const Akreditasi = () => {
  const { t } = useTranslation('academic');

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
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-6"
          >
            <ShieldCheck size={18} />
            <span className="text-sm font-bold tracking-wide uppercase">{t('accreditation.badge')}</span>
          </m.div>
          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-6 text-slate-900 dark:text-white"
          >
            {t('accreditation.title')} <span className="gradient-text">{t('accreditation.title_accent')}</span>
          </m.h1>
          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
          >
            {t('accreditation.subtitle')}
          </m.p>
        </div>

        {/* Accreditation Cards */}
        <m.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
        >
          {/* National Accreditation */}
          <m.div 
            variants={itemVariants}
            className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Award size={160} />
            </div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-8">
                <Award size={32} />
              </div>
              <h3 className="text-sm font-black text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em] mb-3">
                {t('accreditation.national.title')}
              </h3>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                  {t('accreditation.national.status')}
                </h2>
                <div className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  Nasional
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                {t('accreditation.national.body')}
              </p>
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs">
                  ID
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Dikeluarkan Oleh</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('accreditation.national.issued_by')}</p>
                </div>
              </div>
            </div>
          </m.div>

          {/* International Accreditation */}
          <m.div 
            variants={itemVariants}
            className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Globe size={160} />
            </div>

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-8">
                <Globe size={32} />
              </div>
              <h3 className="text-sm font-black text-sky-600 dark:text-sky-400 uppercase tracking-[0.2em] mb-3">
                {t('accreditation.international.title')}
              </h3>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                  {t('accreditation.international.status')}
                </h2>
                <div className="px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  Internasional
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                {t('accreditation.international.body')}
              </p>
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs">
                  DE
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Dikeluarkan Oleh</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('accreditation.international.issued_by')}</p>
                </div>
              </div>
            </div>
          </m.div>
        </m.div>

        {/* Certificates Section */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden relative"
        >
          {/* Background Decorative Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-xl">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
                {t('accreditation.certificates.title')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                {t('accreditation.certificates.desc')}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 pr-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 hover:bg-primary-600 dark:hover:bg-primary-600 hover:text-white border border-slate-100 dark:border-slate-800 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:bg-white/20 group-hover:text-white transition-all">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-0.5 opacity-60">BAN-PT</p>
                  <p className="font-bold whitespace-nowrap">{t('accreditation.certificates.ban_pt')}</p>
                </div>
                <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink size={18} />
                </div>
              </a>

              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 pr-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 hover:bg-sky-600 dark:hover:bg-sky-600 hover:text-white border border-slate-100 dark:border-slate-800 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:bg-white/20 group-hover:text-white transition-all">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-0.5 opacity-60">ACQUIN</p>
                  <p className="font-bold whitespace-nowrap">{t('accreditation.certificates.acquin')}</p>
                </div>
                <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink size={18} />
                </div>
              </a>
            </div>
          </div>
        </m.div>
      </div>
    </div>
  );
};

export default Akreditasi;
