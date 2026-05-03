import React from 'react';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import { GraduationCap, MessageCircle, Quote, Briefcase, Award, TrendingUp } from 'lucide-react';

const KolomAlumni = () => {
  const { t } = useTranslation('academic');

  const testimonials = [
    {
      name: "Fulan bin Fulan",
      year: "Angkatan 2018",
      role: "Pengajar di Pesantren Modern",
      text: "PBA UIN Jakarta tidak hanya mengajarkan bahasa, tetapi juga cara menjadi pendidik yang memahami psikologi peserta didik.",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200"
    },
    {
      name: "Fulanah binti Fulan",
      year: "Angkatan 2019",
      role: "Penerjemah Profesional",
      text: "Bekas ilmu dari dosen-dosen PBA sangat relevan dengan kebutuhan industri penerjemahan saat ini.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
    }
  ];

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
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-6"
            >
              <GraduationCap size={18} />
              <span className="text-sm font-bold tracking-wide uppercase">{t('alumni_column.subtitle')}</span>
            </m.div>
            <m.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black mb-6 text-slate-900 dark:text-white"
            >
              {t('alumni_column.title')}
            </m.h1>
            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto"
            >
              {t('alumni_column.desc')}
            </m.p>
          </div>

          {/* Stats/Inspiration Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {[
              { icon: Briefcase, title: "Karir Global", desc: "Alumni tersebar di berbagai sektor internasional." },
              { icon: Award, title: "Kompetensi Tinggi", desc: "Lulusan dibekali sertifikasi bahasa dan pedagogi." },
              { icon: TrendingUp, title: "Jejaring Luas", desc: "Ikatan alumni yang kuat mendukung perkembangan karir." }
            ].map((item, idx) => (
              <m.div 
                key={idx}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto mb-6">
                  <item.icon size={24} />
                </div>
                <h4 className="font-black text-slate-900 dark:text-white mb-2">{item.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
              </m.div>
            ))}
          </div>

          {/* Opinion Section */}
          <div className="relative">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-1 w-12 bg-primary-500" />
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">{t('alumni_column.opinion_title')}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testi, idx) => (
                <m.div
                  key={idx}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="relative p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-2xl transition-all duration-500"
                >
                  <Quote className="absolute top-8 right-10 text-primary-500/10 group-hover:text-primary-500/20 transition-colors" size={80} />
                  
                  <div className="relative z-10">
                    <p className="text-lg text-slate-700 dark:text-slate-300 italic leading-relaxed mb-8">
                      "{testi.text}"
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg border-2 border-primary-100">
                        <img src={testi.image} alt={testi.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h5 className="font-black text-slate-900 dark:text-white leading-none mb-1">{testi.name}</h5>
                        <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1">{testi.year}</p>
                        <p className="text-xs text-slate-400 font-medium">{testi.role}</p>
                      </div>
                    </div>
                  </div>
                </m.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KolomAlumni;
