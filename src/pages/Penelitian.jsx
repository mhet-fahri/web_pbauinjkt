import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Newspaper, 
  Book, 
  User, 
  Calendar, 
  ExternalLink, 
  FlaskConical, 
  Database,
  Loader2,
  TrendingUp,
  Award,
  Sparkles,
  Quote
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

const Penelitian = () => {
  const { t } = useTranslation(['academic', 'common']);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Semua');
  const [selectedYear, setSelectedYear] = useState('Semua');
  const [dbResearch, setDbResearch] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ['Semua', 'Penelitian', 'Publikasi'];

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        if (!supabase) {
          setLoading(false);
          return;
        }
        // Hanya ambil data yang statusnya 'approved' atau belum ada status (data lama)
        const { data, error } = await supabase
          .from('publications_data')
          .select('*')
          .or('status.eq.approved,status.is.null')
          .order('year', { ascending: false });
        
        if (error) throw error;
        setDbResearch(data || []);
      } catch (err) {
        console.error('Error fetching research:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResearch();
  }, []);

  const displayResearch = dbResearch;

  // Daftar tahun unik untuk filter
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(displayResearch.map(d => d.year).filter(Boolean)));
    return ['Semua', ...years.sort((a, b) => Number(b) - Number(a))];
  }, [displayResearch]);

  // Statistik & Metrik KPI
  const stats = useMemo(() => {
    const total = displayResearch.length;
    const researchCount = displayResearch.filter(d => d.category === 'Penelitian').length;
    const publicationCount = displayResearch.filter(d => d.category === 'Publikasi').length;
    const totalCitations = displayResearch.reduce((acc, curr) => acc + (Number(curr.citations) || 0), 0);
    const scopusCount = displayResearch.filter(d => 
      (d.type || '').toLowerCase().includes('scopus') || 
      (d.journal_name || '').toLowerCase().includes('scopus')
    ).length;

    return { total, researchCount, publicationCount, totalCitations, scopusCount };
  }, [displayResearch]);

  // Tren publikasi per tahun (5-6 tahun terakhir)
  const yearlyTrend = useMemo(() => {
    const counts = {};
    displayResearch.forEach(item => {
      if (item.year) {
        counts[item.year] = (counts[item.year] || 0) + 1;
      }
    });

    const sortedYears = Object.keys(counts).sort((a, b) => Number(a) - Number(b));
    // Ambil maksimal 6 tahun terakhir
    const recentYears = sortedYears.slice(-6);
    const maxVal = Math.max(...recentYears.map(y => counts[y]), 1);

    return recentYears.map(year => ({
      year,
      count: counts[year],
      percentage: Math.round((counts[year] / maxVal) * 100)
    }));
  }, [displayResearch]);

  // Filter Data
  const filteredData = useMemo(() => {
    return displayResearch.filter(item => {
      const authorsString = Array.isArray(item.authors) ? item.authors.join(', ') : (item.authors || '');
      const matchesSearch = 
        (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        authorsString.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.journal_name || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTab = activeTab === 'Semua' || item.category === activeTab;
      const matchesYear = selectedYear === 'Semua' || String(item.year) === String(selectedYear);

      return matchesSearch && matchesTab && matchesYear;
    });
  }, [searchTerm, activeTab, selectedYear, displayResearch]);

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50 dark:bg-slate-950">
      <SEO 
        title={t('penelitian.title')} 
        description={t('penelitian.subtitle')}
        url="/penelitian"
      />
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-6 text-slate-900 dark:text-white"
          >
            {t('penelitian.title')} <span className="gradient-text">{t('penelitian.title_accent')}</span>
          </m.h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {t('penelitian.subtitle')}
          </p>
        </div>

        {/* Journals Section */}
        <div className="mb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{t('penelitian.journals.title')}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {t('penelitian.journals.subtitle')}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <m.a
              href="https://journal.uinjkt.ac.id/index.php/arabiyat"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5 }}
              className="group bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Book size={24} />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {t('penelitian.journals.arabiyat.rank')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 leading-tight group-hover:text-indigo-600 transition-colors">
                  {t('penelitian.journals.arabiyat.name')}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm mt-4">
                Kunjungi Jurnal <ExternalLink size={14} />
              </div>
            </m.a>

            <m.a
              href="https://journal.uinjkt.ac.id/kalimatuna"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5 }}
              className="group bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Book size={24} />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {t('penelitian.journals.kalimatuna.rank')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 leading-tight group-hover:text-emerald-600 transition-colors">
                  {t('penelitian.journals.kalimatuna.name')}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mt-4">
                Kunjungi Jurnal <ExternalLink size={14} />
              </div>
            </m.a>
          </div>
        </div>

        {/* Stats Row & Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Karya', value: stats.total, icon: Database, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { label: 'Publikasi Ilmiah', value: stats.publicationCount, icon: Newspaper, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
            { label: 'Total Sitasi', value: stats.totalCitations, icon: Quote, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
            { label: 'Penelitian & Hibah', value: stats.researchCount, icon: FlaskConical, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          ].map((stat, i) => (
            <m.div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                <stat.icon size={22} />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            </m.div>
          ))}
        </div>

        {/* Visualisasi Tren Publikasi */}
        {yearlyTrend.length > 0 && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-1">
                  <TrendingUp size={16} /> Tren Riset Prodi
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Pertumbuhan Publikasi Ilmiah Tahunan</h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">Data terindeks Google Scholar & Scopus</span>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 items-end h-44">
                {yearlyTrend.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center h-full justify-end group">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.count} karya
                    </span>
                    <div className="w-full max-w-[48px] bg-slate-100 dark:bg-slate-800 rounded-t-xl overflow-hidden flex items-end h-32">
                      <m.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(item.percentage, 15)}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className="w-full bg-gradient-to-t from-indigo-600 to-sky-500 rounded-t-xl group-hover:from-indigo-500 group-hover:to-sky-400 transition-all shadow-md shadow-indigo-500/20"
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2">
                      {item.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 items-center justify-between">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === cat ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600'
                  }`}
                >
                  {cat === 'Semua' ? t('penelitian.tabs.all') : cat === 'Penelitian' ? t('penelitian.tabs.research') : t('penelitian.tabs.publication')}
                </button>
              ))}
            </div>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            >
              {availableYears.map(yr => (
                <option key={yr} value={yr}>
                  {yr === 'Semua' ? 'Semua Tahun' : yr}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder={t('penelitian.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary-600" size={40} />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <Newspaper className="mx-auto text-slate-300 dark:text-slate-700 mb-3" size={44} />
            <p className="text-slate-600 dark:text-slate-400 font-bold">Tidak ada karya yang sesuai kriteria pencarian.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <m.div key={activeTab + searchTerm + selectedYear} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredData.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-7 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between h-full group hover:border-indigo-500/50">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          item.category === 'Penelitian' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-800' 
                            : 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-800'
                        }`}>
                          {item.category === 'Penelitian' ? t('penelitian.tabs.research') : t('penelitian.tabs.publication')}
                        </span>
                        {item.type && (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                            {item.type}
                          </span>
                        )}
                        {Number(item.citations) > 0 && (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Quote size={10} /> {item.citations} Sitasi
                          </span>
                        )}
                      </div>
                      <div className="text-slate-400 text-xs font-bold flex items-center gap-1 shrink-0">
                        <Calendar size={13} /> {item.year}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h3>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <User size={13} className="mt-0.5 shrink-0 text-slate-400" />
                        <span>{Array.isArray(item.authors) ? item.authors.join(', ') : item.authors}</span>
                      </div>
                      {item.journal_name && (
                        <div className="flex items-start gap-2 text-xs text-slate-500 italic">
                          <Book size={13} className="mt-0.5 shrink-0 text-slate-400" />
                          <span>{item.journal_name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {item.source === 'openalex' ? 'OpenAlex / Scholar' : item.source === 'crossref' ? 'CrossRef DOI' : (item.source || 'PBA Riset')}
                    </span>
                    {item.link && item.link !== '#' && (
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-indigo-600 hover:text-indigo-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        {t('penelitian.view_work')} <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </m.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Penelitian;
