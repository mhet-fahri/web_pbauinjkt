import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, User, ArrowRight, Loader2, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';

const ExamCards = () => {
  const { t, i18n } = useTranslation();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const fetchLatestExams = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('exams')
          .select('*')
          .gte('date', today)
          .order('date', { ascending: true })
          .limit(10);

        if (error) throw error;
        setExams(data || []);
      } catch (error) {
        console.error('Error fetching exams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestExams();
  }, []);

  const nextExam = () => {
    setCurrentIndex((prev) => (prev + 1) % exams.length);
  };

  const prevExam = () => {
    setCurrentIndex((prev) => (prev - 1 + exams.length) % exams.length);
  };

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'seminar_proposal': return 'bg-amber-50 text-amber-600 dark:bg-amber-900/20';
      case 'komprehensif': return 'bg-emerald-50 text-emerald-600 dark:bg-amber-900/20';
      case 'skripsi': return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const getLabel = (type) => {
    return t(`pages.home.exam_schedule.types.${type}`, type);
  };

  if (loading) return (
    <div className="flex justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('pages.home.exam_schedule.loading')}</p>
      </div>
    </div>
  );

  if (exams.length === 0) return (
    <div className="text-center py-12 bg-white dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800">
      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{t('pages.home.exam_schedule.no_data')}</p>
    </div>
  );

  const exam = exams[currentIndex];

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={exam.id}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none relative overflow-hidden group h-full flex flex-col"
        >
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getBadgeStyle(exam.type)}`}>
                {getLabel(exam.type)}
              </span>
              <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-blue-500 transition-colors">
                <Calendar size={14} />
              </div>
            </div>
            
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6 leading-tight line-clamp-2 min-h-[3rem]">
              {exam.title}
            </h4>

            <div className="space-y-4 mb-8 flex-grow">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shrink-0">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{exam.student_name}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">{t('pages.home.exam_schedule.nim')}: {exam.student_nim || '-'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                  <Clock size={16} />
                </div>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {new Date(exam.date).toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'id-ID', { day: 'numeric', month: 'short' })} • {exam.time} WIB
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                  <MapPin size={16} />
                </div>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400 truncate">{exam.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-auto pt-4 border-t border-slate-50 dark:border-slate-800">
              <button 
                onClick={prevExam}
                className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 transition-all border border-slate-100 dark:border-slate-800 flex items-center justify-center"
              >
                <ArrowRight size={16} className={`${i18n.language === 'ar' ? '' : 'rotate-180'}`} />
              </button>
              <button 
                onClick={() => setIsDetailOpen(true)}
                className="flex-grow h-10 rounded-xl bg-slate-900 dark:bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-slate-900/10"
              >
                {t('pages.home.exam_schedule.detail_button')} <ArrowRight size={14} className={`${i18n.language === 'ar' ? 'rotate-180' : ''}`} />
              </button>
              <button 
                onClick={nextExam}
                className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 transition-all border border-slate-100 dark:border-slate-800 flex items-center justify-center"
              >
                <ArrowRight size={16} className={`${i18n.language === 'ar' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <div className="flex justify-center gap-1 mt-4">
        {exams.map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? 'w-4 bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
        ))}
      </div>

      {/* Detail Modal - Rendered via Portal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isDetailOpen && (
            <div className="fixed inset-0 z-[2147483647] flex items-center justify-center p-4" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setIsDetailOpen(false)} 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md z-0" 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 10 }} 
                className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getBadgeStyle(exam.type)}`}>
                    {getLabel(exam.type)}
                  </span>
                  <button 
                    onClick={() => setIsDetailOpen(false)}
                    className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-colors"
                  >
                    <ArrowRight size={18} className="rotate-45" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 md:p-8 space-y-5 md:space-y-8 overflow-y-auto max-h-[92vh] custom-scrollbar text-left rtl:text-right">
                  {/* Title Section */}
                  <div className="rtl:text-right">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
                      {exam.title}
                    </h2>
                    <div className="h-1 w-12 bg-blue-600 rounded-full rtl:mr-0 rtl:ml-auto" />
                  </div>

                  {/* Student Info Card */}
                  <div className="flex items-center gap-4 p-5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 shadow-sm shadow-blue-500/5">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                      <User size={22} />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{exam.student_name}</p>
                      <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-1 uppercase tracking-widest">{t('pages.home.exam_schedule.nim')}: {exam.student_nim}</p>
                    </div>
                  </div>

                  {/* Logistics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={14} className="text-slate-400" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('pages.home.exam_schedule.date')}</p>
                      </div>
                      <p className="font-bold text-slate-700 dark:text-slate-200">
                        {new Date(exam.date).toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock size={14} className="text-slate-400" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('pages.home.exam_schedule.time')}</p>
                      </div>
                      <p className="font-bold text-slate-700 dark:text-slate-200">{exam.time} WIB</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={14} className="text-slate-400" />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('pages.home.exam_schedule.location')}</p>
                    </div>
                    <p className="font-bold text-slate-700 dark:text-slate-200">{exam.location}</p>
                  </div>

                  {/* Examiners Section */}
                  <div className="space-y-4 pt-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-6 h-[2px] bg-slate-200 dark:bg-slate-800" />
                      {t('pages.home.exam_schedule.examiners_title')}
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {[exam.examiner_1, exam.examiner_2].filter(Boolean).map((ex, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                            <Star size={14} fill="currentColor" />
                          </div>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{ex}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Button */}
                <div className="p-4 md:p-6 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => setIsDetailOpen(false)}
                    className="w-full py-4 rounded-xl bg-slate-900 dark:bg-blue-600 text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-slate-900/10 dark:shadow-blue-600/20"
                  >
                    {t('pages.home.exam_schedule.close_button')}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default ExamCards;
