import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  ClipboardList,
  MessageSquare,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

const LayananAkademik = () => {
  const { t } = useTranslation();
  const services = [
    {
      title: t('pages.mahasiswa.layanan.service_1_title'),
      desc: t('pages.mahasiswa.layanan.service_1_desc'),
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: t('pages.mahasiswa.layanan.service_2_title'),
      desc: t('pages.mahasiswa.layanan.service_2_desc'),
      icon: ShieldCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20"
    },
    {
      title: t('pages.mahasiswa.layanan.service_3_title'),
      desc: t('pages.mahasiswa.layanan.service_3_desc'),
      icon: ClipboardList,
      color: "text-indigo-600",
      bg: "bg-indigo-50 dark:bg-indigo-900/20"
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
      {/* Decorative BG */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-bold mb-8"
          >
            <HelpCircle size={16} />
            <span>{t('pages.mahasiswa.layanan.badge')}</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 leading-tight"
          >
            {t('pages.mahasiswa.layanan.title')} <span className="gradient-text">{t('pages.mahasiswa.layanan.title_accent')}</span>
          </motion.h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {t('pages.mahasiswa.layanan.subtitle')}
          </p>
        </div>

        {/* Primary CTA Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl mx-auto mb-20"
        >
          <div className="bg-primary-600 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <h2 className="text-3xl font-black mb-6 leading-tight">{t('pages.mahasiswa.layanan.portal_title')}</h2>
                <p className="text-primary-100 mb-10 leading-relaxed">
                  {t('pages.mahasiswa.layanan.portal_desc')}
                </p>
                <div className="flex flex-col gap-4 mb-10 text-sm font-bold">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-primary-300" />
                    <span>{t('pages.mahasiswa.layanan.portal_feature_1')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-primary-300" />
                    <span>{t('pages.mahasiswa.layanan.portal_feature_2')}</span>
                  </div>
                </div>
                <a 
                  href="https://s.id/pba-uinjkt?s=qr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary-600 rounded-2xl font-black shadow-xl hover:bg-primary-50 transition-all group"
                >
                  {t('pages.mahasiswa.layanan.portal_cta')} <ExternalLink size={20} className="group-hover:rotate-12 transition-transform" />
                </a>
              </div>
              <div className="hidden lg:flex justify-center">
                <div className="w-64 h-64 bg-white p-6 rounded-3xl shadow-2xl">
                  {/* Simulated QR Placeholder or Icon */}
                  <div className="w-full h-full border-4 border-dashed border-primary-100 rounded-2xl flex flex-col items-center justify-center text-primary-200">
                    <MessageSquare size={80} strokeWidth={1} />
                    <span className="text-[10px] uppercase font-black tracking-widest mt-4">{t('pages.mahasiswa.layanan.portal_badge')}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative background circle */}
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-[80px]" />
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <item.icon size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">{item.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
                {item.desc}
              </p>
              <div className="flex items-center gap-2 text-xs font-black text-primary-600 uppercase tracking-widest">
                {t('pages.mahasiswa.layanan.learn_flow')} <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LayananAkademik;
