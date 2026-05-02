import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import { 
  GraduationCap, 
  Search, 
  MapPin, 
  Briefcase, 
  Building2, 
  MessageSquareQuote,
  Loader2
} from 'lucide-react';
import { alumniStories as demoAlumni } from '../data/alumni';
import { supabase } from '../lib/supabase';
import { getDirectImageUrl } from '../utils/imageUtils';

const DataAlumni = () => {
  const { t } = useTranslation(['student', 'common']);
  const [searchTerm, setSearchTerm] = useState('');
  const [dbAlumni, setDbAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const { data, error } = await supabase
          .from('alumni_data')
          .select('*')
          .order('graduation_year', { ascending: false });
        
        if (error) throw error;
        // Transform data format to match demoAlumni
        const formatted = (data || []).map(a => ({
          id: a.id,
          name: a.name,
          batch: a.graduation_year,
          position: a.position,
          company: a.company,
          testimony: a.testimony,
          image_url: a.image_url,
          avatar: a.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        }));
        setDbAlumni(formatted);
      } catch (err) {
        console.error('Error fetching alumni:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlumni();
  }, []);

  const displayAlumni = dbAlumni.length > 0 ? dbAlumni : demoAlumni;

  const filteredAlumni = useMemo(() => {
    return displayAlumni.filter(a => 
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, displayAlumni]);

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50 dark:bg-slate-950">
      <div className="container-custom">
        <div className="max-w-4xl mb-16 text-center mx-auto">
          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-6 text-slate-900 dark:text-white"
          >
            {t('alumni.data.title')} <span className="gradient-text">{t('alumni.data.title_accent')}</span>
          </m.h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {t('alumni.data.subtitle')}
          </p>
        </div>

        <div className="relative max-w-xl mx-auto mb-16">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder={t('alumni.data.search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-emerald-600" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAlumni.map((alumnus, i) => (
              <m.div
                key={alumnus.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center text-emerald-600 font-black text-xl shrink-0">
                    {alumnus.image_url ? (
                      <img src={getDirectImageUrl(alumnus.image_url, 150)} alt={alumnus.name} className="w-full h-full object-cover" />
                    ) : (
                      alumnus.avatar || 'AL'
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{alumnus.name}</h3>
                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">{t('alumni.data.batch_label')} {alumnus.batch}</div>
                  </div>
                </div>

                <div className="space-y-4 flex-grow">
                  <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <Briefcase size={16} className="text-slate-400 mt-1 shrink-0" />
                    <span>{alumnus.position}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <Building2 size={16} className="text-slate-400 mt-1 shrink-0" />
                    <span>{alumnus.company}</span>
                  </div>
                </div>

                {alumnus.testimony && (
                  <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 relative">
                    <MessageSquareQuote size={24} className="absolute -top-3 left-6 text-emerald-100 dark:text-emerald-900/30" />
                    <p className="text-xs text-slate-500 italic leading-relaxed">
                      "{alumnus.testimony}"
                    </p>
                  </div>
                )}
              </m.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataAlumni;
