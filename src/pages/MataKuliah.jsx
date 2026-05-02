import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { m, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Clock, Tag, ChevronRight, Info, Filter, X, Plus, CheckCircle2 } from 'lucide-react';
import { courses } from '../data/courses';

const MataKuliah = () => {
  const { t } = useTranslation(['academic', 'common']);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSemester, setActiveSemester] = useState('Semua');
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // State for interactive selections
  const [selections, setSelections] = useState({
    sem6: [null, null],
    sem7: [null]
  });
  const [isSelecting, setIsSelecting] = useState(null); // { sem: 'sem6', index: 0 }

  const semesters = ['Semua', '1', '2', '3', '4', '5', '6', '7', '8', 'Pilihan'];

  const allElectives = useMemo(() => courses.filter(c => c.jenis === 'Pilihan'), []);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           course.kode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSemester = activeSemester === 'Semua' || course.semester.includes(activeSemester);
      
      // If we are in a specific semester tab, we might want to hide electives that aren't "selected"
      // to avoid clutter, especially since we have special slots now.
      // But for "Pilihan" tab or "Semua", we show everything.
      if (activeSemester === '6' || activeSemester === '7') {
        return matchesSearch && course.jenis === 'Wajib' && course.semester.includes(activeSemester);
      }
      
      return matchesSearch && matchesSemester;
    });
  }, [searchTerm, activeSemester]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleSelectElective = (course) => {
    if (!isSelecting) return;
    
    const newSelections = { ...selections };
    newSelections[isSelecting.sem][isSelecting.index] = course;
    setSelections(newSelections);
    setIsSelecting(null);
  };

  // Elective Slot Component
  const ElectiveSlot = ({ sem, index, label }) => {
    const selected = selections[sem][index];
    
    return (
      <m.div
        variants={itemVariants}
        whileHover={{ y: -5 }}
        onClick={() => selected ? setSelectedCourse(selected) : setIsSelecting({ sem, index })}
        className={`group relative rounded-3xl p-6 border transition-all cursor-pointer overflow-hidden ${
          selected 
            ? 'bg-white dark:bg-slate-900 border-sky-200 dark:border-sky-900/50 shadow-lg shadow-sky-500/10' 
            : 'bg-slate-50/50 dark:bg-slate-900/50 border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl transition-colors ${
            selected 
              ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-600' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-500'
          }`}>
            {selected ? <CheckCircle2 size={24} /> : <Plus size={24} />}
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1 block">
              {selected ? selected.kode : `${t('mata_kuliah.elective_section.slot_prefix')} ${index + 1}`}
            </span>
            <h3 className={`font-bold text-lg leading-tight transition-colors ${
              selected ? 'text-slate-900 dark:text-white' : 'text-slate-400 group-hover:text-sky-500'
            }`}>
              {selected ? selected.nama : t('mata_kuliah.elective_section.click_to_select')}
            </h3>
          </div>
          {selected && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                const newSelections = { ...selections };
                newSelections[sem][index] = null;
                setSelections(newSelections);
              }}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        {selected && (
          <div className="flex gap-3 mt-4">
             <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                <Clock size={12} /> {selected.sks} SKS
             </div>
             <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                <Tag size={12} /> {t('mata_kuliah.stats.elective')}
             </div>
          </div>
        )}
      </m.div>
    );
  };

  // Calculate stats for the visualizer
  const stats = useMemo(() => {
    const data = Array(8).fill(0).map((_, i) => {
      const semStr = (i + 1).toString();
      const semesterCourses = courses.filter(c => 
        c.semester === semStr || 
        (c.semester && c.semester.includes(semStr) && c.jenis === 'Wajib')
      );
      
      return {
        semester: semStr,
        sks: semesterCourses.reduce((acc, curr) => acc + Number(curr.sks || 0), 0),
        count: semesterCourses.length
      };
    });
    
    const totalSks = courses.reduce((acc, curr) => acc + Number(curr.sks || 0), 0);
    const totalWajib = courses.filter(c => c.jenis === 'Wajib').length;
    const totalPilihan = courses.filter(c => c.jenis === 'Pilihan').length;

    return { data, totalSks, totalWajib, totalPilihan };
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50 dark:bg-slate-950">
      <div className="container-custom">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 mb-6"
          >
            <BookOpen size={18} />
            <span className="text-sm font-bold tracking-wide uppercase">{t('mata_kuliah.badge')}</span>
          </m.div>
          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-6 text-slate-900 dark:text-white"
          >
            {t('mata_kuliah.title')} <span className="gradient-text">{t('mata_kuliah.title_accent')}</span>
          </m.h1>
          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
          >
            {t('mata_kuliah.subtitle')}
          </m.p>
        </div>

        {/* Search and Filter */}
        <div className="sticky top-24 z-30 mb-12 space-y-6">
          <m.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative max-w-2xl mx-auto"
          >
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-sky-500 text-slate-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder={t('mata_kuliah.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all shadow-xl shadow-slate-200/50 dark:shadow-none"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </m.div>

          <m.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 max-w-5xl mx-auto"
          >
            {semesters.map((sem) => (
              <button
                key={sem}
                onClick={() => setActiveSemester(sem)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                  activeSemester === sem
                    ? 'bg-sky-600 border-sky-600 text-white shadow-lg shadow-sky-600/30 scale-105'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-sky-500 hover:text-sky-500'
                }`}
              >
                {sem === 'Semua' ? t('mata_kuliah.semesters.all') : sem === 'Pilihan' ? t('mata_kuliah.semesters.elective') : `${t('mata_kuliah.semesters.label')} ${sem}`}
              </button>
            ))}
          </m.div>
        </div>

        {/* Visual Dashboard - Only for "Semua" filter */}
        {activeSemester === 'Semua' && !searchTerm && (
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* SKS per Semester Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{t('mata_kuliah.stats.study_load')}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">{t('mata_kuliah.stats.distribution')}</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                   <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-500" /> SKS</div>
                </div>
              </div>
              
              <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-2">
                {stats.data.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                    <div className="relative w-full flex flex-col items-center justify-end h-full">
                       {/* Tooltip */}
                       <m.div 
                         initial={{ opacity: 0, y: 5 }}
                         whileHover={{ opacity: 1, y: -5 }}
                         className="absolute -top-10 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10"
                       >
                         {d.sks} SKS
                       </m.div>
                       
                       {/* Bar */}
                       <m.div
                         initial={{ height: 0 }}
                         whileInView={{ height: `${Math.max((d.sks / 24) * 100, 2)}%` }}
                         viewport={{ once: true }}
                         transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                         className="w-full max-w-[40px] bg-gradient-to-t from-sky-600 to-sky-400 rounded-t-xl group-hover:from-sky-500 group-hover:to-sky-300 transition-all shadow-lg shadow-sky-500/10"
                       />
                    </div>
                    <span className="text-xs font-black text-slate-400 group-hover:text-sky-600 transition-colors">S{d.semester}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-col gap-6">
              <div className="flex-1 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                    <CheckCircle2 size={24} />
                  </div>
                  <div className="text-4xl font-black mb-1">{stats.totalSks}</div>
                  <div className="text-xs font-bold uppercase tracking-widest opacity-80">{t('mata_kuliah.stats.total_sks')}</div>
                </div>
              </div>

              <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">{t('mata_kuliah.stats.structure')}</h4>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{t('mata_kuliah.stats.composition')}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400">
                    <Tag size={20} />
                  </div>
                </div>
                
                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-sky-500" />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('mata_kuliah.stats.compulsory')}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{stats.totalWajib}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <m.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.totalWajib / (stats.totalWajib + stats.totalPilihan)) * 100}%` }}
                      className="h-full bg-sky-500 rounded-full"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('mata_kuliah.stats.elective')}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{stats.totalPilihan}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <m.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.totalPilihan / (stats.totalWajib + stats.totalPilihan)) * 100}%` }}
                      className="h-full bg-indigo-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        )}

        {/* Course Grid */}
        <AnimatePresence mode="wait">
          <m.div
            key={activeSemester + searchTerm}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-12"
          >
            {/* Wajib Courses Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <m.div
                  key={course.kode}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedCourse(course)}
                  className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="p-2 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400">
                      <ChevronRight size={18} />
                    </div>
                  </div>

                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-sky-50 dark:group-hover:bg-sky-900/20 group-hover:text-sky-600 transition-colors">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1 block">
                        {course.kode}
                      </span>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight group-hover:text-sky-600 transition-colors">
                        {course.nama}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-auto">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                      <Clock size={14} className="text-sky-500" />
                      {course.sks} SKS
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                      <Tag size={14} className="text-indigo-500" />
                      {course.jenis === 'Wajib' ? t('mata_kuliah.stats.compulsory') : t('mata_kuliah.stats.elective')}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                      <Filter size={14} className="text-emerald-500" />
                      {t('mata_kuliah.semesters.label')} {course.semester}
                    </div>
                  </div>
                </m.div>
              ))}
            </div>

            {/* Special Elective Sections for Sem 6 and 7 */}
            {(activeSemester === '6' || activeSemester === '7') && !searchTerm && (
              <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-600">
                    <Filter size={20} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('mata_kuliah.elective_section.title')}</h2>
                </div>
                
                <div className={`grid gap-6 ${activeSemester === '6' ? 'md:grid-cols-2' : 'grid-cols-1 max-w-2xl'}`}>
                  {activeSemester === '6' ? (
                    <>
                      <ElectiveSlot sem="sem6" index={0} />
                      <ElectiveSlot sem="sem6" index={1} />
                    </>
                  ) : (
                    <ElectiveSlot sem="sem7" index={0} />
                  )}
                </div>
                <p className="mt-4 text-sm text-slate-500 italic">
                  {t('mata_kuliah.elective_section.footer_note', { semester: activeSemester })}
                </p>
              </div>
            )}

            {filteredCourses.length === 0 && (activeSemester !== '6' && activeSemester !== '7') && (
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400 mb-4">
                  <Search size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('mata_kuliah.not_found.title')}</h3>
                <p className="text-slate-600 dark:text-slate-400">{t('mata_kuliah.not_found.desc')}</p>
              </m.div>
            )}
          </m.div>
        </AnimatePresence>
      </div>

      {/* Elective Selection Modal */}
      <AnimatePresence>
        {isSelecting && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSelecting(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <m.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl z-[151]"
            >
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-white/10 max-h-[80vh] flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('mata_kuliah.elective_section.modal_title')}</h2>
                    <p className="text-sm text-slate-500">{t('mata_kuliah.semesters.label')} {isSelecting.sem === 'sem6' ? '6' : '7'}</p>
                  </div>
                  <button onClick={() => setIsSelecting(null)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 space-y-3">
                  {allElectives.map(course => (
                    <button
                      key={course.kode}
                      onClick={() => handleSelectElective(course)}
                      className="w-full text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-sky-50 dark:hover:bg-sky-900/20 border border-slate-100 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 transition-all group"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase tracking-wider">{course.kode}</span>
                          <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">{course.nama}</h4>
                        </div>
                        <div className="text-xs font-black text-sky-600 bg-sky-100 dark:bg-sky-900/30 px-3 py-1 rounded-lg">
                          {course.sks} SKS
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>

      {/* Course Detail Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourse(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <m.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl z-[101]"
            >
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden relative border border-white/10 max-h-[90vh] flex flex-col">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
                >
                  <X size={20} />
                </button>

                <div className="overflow-y-auto custom-scrollbar flex-1 pr-2">
                  <div className="flex items-start gap-6 mb-8">
                    <div className="p-4 rounded-[2rem] bg-sky-600 text-white shadow-xl shadow-sky-600/20 shrink-0">
                      <BookOpen size={32} />
                    </div>
                    <div>
                      <span className="text-xs font-black tracking-widest text-sky-600 dark:text-sky-400 uppercase mb-2 block">
                        {selectedCourse.kode}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                        {selectedCourse.nama}
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl text-center border border-slate-100 dark:border-slate-800">
                      <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">SKS</div>
                      <div className="text-xl font-black text-sky-600">{selectedCourse.sks}</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl text-center border border-slate-100 dark:border-slate-800">
                      <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{t('mata_kuliah.semesters.label')}</div>
                      <div className="text-xl font-black text-indigo-600">{selectedCourse.semester}</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl text-center border border-slate-100 dark:border-slate-800">
                      <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Jenis</div>
                      <div className="text-xl font-black text-emerald-600">
                        {selectedCourse.jenis === 'Wajib' ? t('mata_kuliah.stats.compulsory') : t('mata_kuliah.stats.elective')}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold mb-2">
                      <Info size={18} className="text-sky-500" />
                      {t('mata_kuliah.modal.desc_title')}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                      {selectedCourse.deskripsi}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end shrink-0">
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="px-8 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:scale-105 transition-transform"
                  >
                    {t('mata_kuliah.modal.close')}
                  </button>
                </div>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MataKuliah;


