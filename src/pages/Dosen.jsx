import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, Mail, ExternalLink, Link as LinkIcon, Users, Loader2, GraduationCap } from 'lucide-react';
import Card from '../components/Card';
import { lecturers as demoLecturers } from '../data/lecturers';
import { supabase } from '../lib/supabase';
import { getDirectImageUrl } from '../utils/imageUtils';

const Dosen = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [dbLecturers, setDbLecturers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const { data, error } = await supabase
          .from('lecturers')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) throw error;
        // Transform Supabase snake_case to match our component's camelCase if needed
        const formatted = (data || []).map(l => ({
          id: l.id,
          name: l.name,
          role: l.position,
          nip: l.nip,
          specialization: l.expertise,
          email: l.email,
          scholar_link: l.scholar_link,
          image: l.image_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200"
        }));

        // Sort by specific criteria
        formatted.sort((a, b) => {
          const getRank = (lecturer) => {
            const role = (lecturer.role || '').toLowerCase();
            const name = (lecturer.name || '').toLowerCase();

            if (role.includes('ketua program studi') || role.includes('kaprodi') || role === 'ketua') return 1;
            if (role.includes('sekretaris') || role.includes('sekprodi')) return 2;
            
            // Pengecualian nama untuk diletakkan sebelum dosen tidak tetap
            const isRoyaniOrAzki = name.includes('royani') || name.includes('azki');
            const isTidakTetap = role.includes('tidak tetap') || role.includes('luar biasa');

            if (isTidakTetap) return 6;
            if (isRoyaniOrAzki) return 5;
            
            if (name.includes('dr.')) return 3; // Doktor (selain Royani/Azki)
            return 4; // Sisanya (Dosen Tetap biasa)
          };

          const rankA = getRank(a);
          const rankB = getRank(b);

          if (rankA !== rankB) {
            return rankA - rankB;
          }
          // Jika ranking sama, urutkan sesuai abjad
          return a.name.localeCompare(b.name);
        });

        setDbLecturers(formatted);
      } catch (err) {
        console.error('Error fetching lecturers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLecturers();
  }, []);

  const displayLecturers = dbLecturers.length > 0 ? dbLecturers : demoLecturers;

  const filteredLecturers = displayLecturers.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-32 pb-20 bg-slate-50/30 dark:bg-transparent min-h-screen">
      <div className="container-custom">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-sm font-bold mb-6"
          >
            <Users size={14} />
            <span>{t('pages.lecturers.badge')}</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
            {t('pages.lecturers.title')} <span className="gradient-text">{t('pages.lecturers.title_accent')}</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t('pages.lecturers.subtitle')}
          </p>
        </div>
          
        <div className="relative max-w-xl mx-auto mb-16">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder={t('pages.lecturers.search_placeholder')}
            className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary-600" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredLecturers.map((lecturer, i) => (
              <Card key={lecturer.id} delay={i * 0.1} className="p-0 overflow-hidden group">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={getDirectImageUrl(lecturer.image, 400) || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200"} 
                    alt={lecturer.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-3">
                      {lecturer.email && (
                        <a href={`mailto:${lecturer.email}`} className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors" title="Email Dosen">
                          <Mail size={16} />
                        </a>
                      )}
                      {lecturer.scholar_link && (
                        <a href={lecturer.scholar_link} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors" title="Google Scholar">
                          <GraduationCap size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">{lecturer.name}</h3>
                  <p className="text-sm text-primary-600 font-medium mb-4">{lecturer.role}</p>
                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">{t('pages.lecturers.nip')}</span>
                      <span className="text-slate-700 dark:text-slate-300">{lecturer.nip}</span>
                    </div>
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="text-slate-500">{t('pages.lecturers.expertise')}</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium line-clamp-1">{lecturer.specialization}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dosen;
