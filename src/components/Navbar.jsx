import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Users, 
  GraduationCap, 
  Home as HomeIcon, 
  Search, 
  Info, 
  Book, 
  Award,
  ChevronDown,
  Newspaper
} from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import logoUin from '../assets/logo-uin.png';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const navLinks = [
    { name: t('nav.home'), path: '/', icon: HomeIcon },
    { 
      name: t('nav.profile'), 
      path: '/profil', 
      icon: Info,
      subLinks: [
        { name: t('nav.profile_history'), path: '/profil/sejarah' },
        { name: t('nav.profile_vision'), path: '/profil/visi' },
        { name: t('nav.profile_goals'), path: '/profil/tujuan' },
        { name: t('nav.profile_graduates'), path: '/profil/lulusan' },
      ]
    },
    { 
      name: t('nav.curriculum'), 
      path: '/kurikulum', 
      icon: Book,
      subLinks: [
        { name: t('nav.curriculum_cpl'), path: '/kurikulum/cpl' },
        { name: t('nav.curriculum_courses'), path: '/kurikulum/matakuliah' },
      ]
    },
    { name: t('nav.lecturers'), path: '/dosen', icon: Users },
    { name: t('nav.research'), path: '/penelitian', icon: Newspaper },
    { 
      name: t('nav.students'), 
      path: '/mahasiswa', 
      icon: GraduationCap,
      subLinks: [
        { name: t('nav.student_data'), path: '/mahasiswa/data' },
        { name: t('nav.student_services'), path: '/mahasiswa/layanan' },
      ]
    },
    { 
      name: t('nav.alumni'), 
      path: '/alumni', 
      icon: Award,
      subLinks: [
        { name: t('nav.alumni_data'), path: '/alumni/data' },
        { name: t('nav.alumni_tracer'), path: '/alumni/tracer-study' },
      ]
    },
  ];

  const languages = [
    { code: 'id', name: 'Indonesia', flag: 'https://flagcdn.com/w40/id.png' },
    { code: 'ar', name: 'Arab', flag: 'https://flagcdn.com/w40/sa.png' },
    { code: 'en', name: 'English', flag: 'https://flagcdn.com/w40/us.png' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled 
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-lg py-2 border-b border-slate-200/50 dark:border-slate-800/50' 
          : 'bg-transparent py-4'
      )}
    >
      {/* Top Bar (Desktop Only) */}
      {!scrolled && (
        <div className="hidden lg:block border-b border-slate-200/10 pb-2 mb-2">
          <div className="container-custom flex justify-end items-center gap-6">
            <div className="flex items-center gap-3">
              {languages.map((lang) => (
                <button 
                  key={lang.code} 
                  onClick={() => changeLanguage(lang.code)}
                  aria-label={`Ganti bahasa ke ${lang.name}`}
                  className={clsx(
                    "hover:scale-110 transition-all flex items-center gap-1.5 px-2 py-1 rounded-md",
                    i18n.language === lang.code ? "bg-indigo-500/10 opacity-100 scale-110" : "opacity-40 hover:opacity-100"
                  )}
                >
                  <img src={lang.flag} alt={`Bendera ${lang.name}`} width={20} height={14} className="w-5 h-auto rounded-sm shadow-sm" />
                  <span className="text-[10px] font-black text-slate-600 dark:text-white uppercase tracking-tighter">{lang.code}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center">
            <img src={logoUin} alt="Logo UIN Syarif Hidayatullah Jakarta" width={48} height={48} className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col leading-[1.1]">
            <span className={clsx(
              "text-[19px] font-extrabold tracking-tight",
              scrolled ? "text-slate-900 dark:text-white" : "text-slate-900 dark:text-white lg:text-slate-900" 
            )}>
              {t('site.name').split(' ').slice(0, -2).join(' ')} <span className="gradient-text">{t('site.name').split(' ').slice(-2).join(' ')}</span>
            </span>
            <span className={clsx(
              "text-[8.5px] uppercase font-bold tracking-[0.15em] mt-1 opacity-70",
              scrolled ? "text-slate-700" : "text-slate-700 lg:text-slate-800"
            )}>{t('site.faculty')}</span>
            <span className={clsx(
              "text-[8.5px] uppercase font-extrabold tracking-[0.2em] text-indigo-600/90",
              scrolled ? "opacity-100" : "opacity-100 lg:opacity-90"
            )}>{t('site.university')}</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-4">
          {navLinks.map((link) => (
            <div 
              key={link.path} 
              className="relative group"
              onMouseEnter={() => link.subLinks && setActiveDropdown(link.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {link.subLinks ? (
                <button
                  className={clsx(
                    'text-[13px] font-bold transition-all hover:text-indigo-600 flex items-center gap-1 py-2',
                    location.pathname.startsWith(link.path) ? 'text-indigo-600' : (scrolled ? 'text-slate-700' : 'text-slate-800 lg:text-slate-900')
                  )}
                >
                  {link.name}
                  <ChevronDown size={14} className={clsx("transition-transform duration-300", activeDropdown === link.name && "rotate-180")} />
                </button>
              ) : (
                <Link
                  to={link.path}
                  className={clsx(
                    'text-[13px] font-bold transition-all hover:text-indigo-600 relative group py-2',
                    location.pathname === link.path ? 'text-indigo-600' : (scrolled ? 'text-slate-700' : 'text-slate-800 lg:text-slate-900')
                  )}
                >
                  {link.name}
                  <span className={clsx(
                    "absolute bottom-0 left-0 h-0.5 bg-indigo-500 transition-all duration-300",
                    location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
                  )} />
                </Link>
              )}

              {/* Dropdown Menu */}
              <AnimatePresence>
                {link.subLinks && activeDropdown === link.name && (
                  <m.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 w-56 bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border border-slate-100 dark:border-slate-800 p-2 mt-2 z-50 overflow-hidden"
                  >
                    {link.subLinks.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        className="flex items-center px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 rounded-xl transition-all"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          
          {/* Scrolled Info */}
          {scrolled && (
            <div className="flex items-center gap-4 ml-2 pl-4 border-l border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => setShowSearch(!showSearch)} 
                aria-label="Cari di website"
                className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
              >
                <Search size={18} />
              </button>
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <button 
                    key={lang.code} 
                    onClick={() => changeLanguage(lang.code)}
                    aria-label={`Ganti bahasa ke ${lang.name}`}
                    className={clsx(
                      "hover:scale-110 transition-all",
                      i18n.language === lang.code ? "opacity-100 scale-110" : "opacity-30"
                    )}
                  >
                    <img src={lang.flag} alt={`Bendera ${lang.name}`} className="w-4 h-auto rounded-sm" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Buttons */}
        <div className="flex items-center gap-4 lg:hidden">
          <button 
            onClick={() => setShowSearch(!showSearch)} 
            aria-label="Cari di website"
            className="p-2 text-slate-900 dark:text-white"
          >
            <Search size={20} />
          </button>
          <button
            className="p-2 text-slate-900 dark:text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <AnimatePresence>
        {showSearch && (
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 p-4 border-t border-slate-100 dark:border-slate-800 shadow-xl"
          >
            <div className="container-custom relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                autoFocus
                placeholder={t('site.search_placeholder')} 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
              />
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-40 bg-white dark:bg-slate-950 lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col h-full pt-24 p-6 gap-2">
              {navLinks.map((link) => (
                <div key={link.path} className="flex flex-col gap-1">
                  {link.subLinks ? (
                    <>
                      <div className="flex items-center gap-4 text-lg font-bold p-4 rounded-2xl text-slate-400 uppercase tracking-widest text-[10px] mt-4">
                        {link.name}
                      </div>
                      {link.subLinks.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          onClick={() => setIsOpen(false)}
                          className={clsx(
                            'flex items-center gap-4 text-base font-bold p-4 rounded-2xl transition-all',
                            location.pathname === sub.path
                              ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                          )}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={clsx(
                        'flex items-center gap-4 text-lg font-bold p-4 rounded-2xl transition-all',
                        location.pathname === link.path
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                      )}
                    >
                      <link.icon size={20} className={clsx(location.pathname === link.path ? "text-indigo-600" : "text-slate-400")} />
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
              
              <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-8 pb-12 px-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Pilih Bahasa</p>
                <div className="grid grid-cols-3 gap-4">
                  {languages.map((lang) => (
                    <button 
                      key={lang.code} 
                      onClick={() => changeLanguage(lang.code)}
                      className={clsx(
                        "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all",
                        i18n.language === lang.code 
                          ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800" 
                          : "border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                      )}
                    >
                      <img src={lang.flag} alt={lang.name} className="w-8 h-auto rounded-md" />
                      <span className={clsx(
                        "text-xs font-bold",
                        i18n.language === lang.code ? "text-indigo-600 dark:text-indigo-400" : "dark:text-white"
                      )}>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
