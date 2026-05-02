import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { 
  LayoutDashboard, 
  Newspaper, 
  Users, 
  GraduationCap, 
  FileText, 
  ArrowUpRight,
  Activity,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Dashboard = () => {
  const [stats, setStats] = useState({
    news: 0,
    lecturers: 0,
    students: 0,
    alumni: 0,
    publications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const tables = [
        { key: 'news', name: 'posts' },
        { key: 'lecturers', name: 'lecturers' },
        { key: 'students', name: 'students_data' },
        { key: 'alumni', name: 'alumni_data' },
        { key: 'publications', name: 'publications_data' }
      ];

      const newStats = { ...stats };

      for (const table of tables) {
        try {
          const { count, error } = await supabase
            .from(table.name)
            .select('*', { count: 'exact', head: true });
          
          if (!error) {
            newStats[table.key] = count || 0;
          }
        } catch (err) {
          console.error(`Error fetching ${table.name}:`, err);
        }
      }

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      label: 'Total Berita', 
      value: stats.news, 
      icon: Newspaper, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50 dark:bg-blue-900/20' 
    },
    { 
      label: 'Data Dosen', 
      value: stats.lecturers, 
      icon: Users, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50 dark:bg-indigo-900/20' 
    },
    { 
      label: 'Data Mahasiswa', 
      value: stats.students, 
      icon: GraduationCap, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50 dark:bg-emerald-900/20' 
    },
    { 
      label: 'Data Alumni', 
      value: stats.alumni, 
      icon: CheckCircle2, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50 dark:bg-amber-900/20' 
    },
    { 
      label: 'Publikasi', 
      value: stats.publications, 
      icon: FileText, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50 dark:bg-rose-900/20' 
    },
  ];

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
          <LayoutDashboard size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400">Selamat datang di Panel Admin PBA UIN Jakarta</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mr-3" />
          <span className="font-bold uppercase tracking-widest text-xs">Menghitung Data...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {statCards.map((stat, i) => (
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label}
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon size={28} />
                </div>
                <div className="text-slate-300 dark:text-slate-700">
                  <Activity size={20} />
                </div>
              </div>
              <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {stat.label}
              </div>
            </m.div>
          ))}

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-blue-600 p-8 rounded-2xl text-white shadow-lg shadow-blue-600/30 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-1">Status Sistem</h3>
              <p className="text-blue-100 text-xs">Database Terhubung</p>
            </div>
            <div className="text-3xl font-black relative z-10 flex items-center gap-2">
              Aktif
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            </div>
            {/* Decorative background icon */}
            <div className="absolute -bottom-4 -right-4 opacity-10">
              <CheckCircle2 size={120} />
            </div>
          </m.div>
        </div>
      )}

      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Siap Mengelola Konten?</h2>
          <p className="text-blue-100 text-lg mb-10 leading-relaxed">
            Anda sekarang terhubung ke database Supabase. Semua perubahan data yang Anda lakukan melalui panel ini akan langsung diperbarui di website utama secara real-time.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-sm font-bold">
              Versi CMS 1.1.0
            </div>
            <div className="px-6 py-3 bg-emerald-500 rounded-2xl text-sm font-bold shadow-lg shadow-emerald-500/20">
              Database Terkoneksi
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-12 opacity-10 hidden lg:block">
          <Activity size={300} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
