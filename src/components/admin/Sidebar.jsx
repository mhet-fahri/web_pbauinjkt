import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Newspaper, 
  Users, 
  FileText, 
  LogOut, 
  Settings,
  ChevronRight,
  GraduationCap,
  Globe,
  Calendar,
  Megaphone
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    navigate('/admin/login');
  };

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Berita & Kegiatan', icon: Newspaper, path: '/admin/news' },
    { label: 'Data Dosen', icon: Users, path: '/admin/lecturers' },
    { label: 'Data Mahasiswa', icon: GraduationCap, path: '/admin/students' },
    { label: 'Data Alumni', icon: Globe, path: '/admin/alumni' },
    { label: 'Publikasi', icon: FileText, path: '/admin/publications' },
    { label: 'Jadwal Ujian', icon: Calendar, path: '/admin/exams' },
    { label: 'Running Text', icon: Megaphone, path: '/admin/running-text' },
  ];

  return (
    <div className="w-72 bg-white dark:bg-slate-900 h-screen sticky top-0 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <Settings size={20} />
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">PBA Admin</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Control Panel</div>
          </div>
        </div>
      </div>

      <nav className="flex-grow p-6 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center justify-between p-3.5 rounded-xl transition-all group
              ${isActive 
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' 
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
            `}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              <span className="text-sm font-bold">{item.label}</span>
            </div>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl transition-all font-bold text-sm"
        >
          <LogOut size={20} />
          Keluar Sesi
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
