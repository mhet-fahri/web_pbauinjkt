import React, { lazy, Suspense } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Loader2 } from 'lucide-react';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Dosen = lazy(() => import('./pages/Dosen'));
const Mahasiswa = lazy(() => import('./pages/Mahasiswa'));
const Profil = lazy(() => import('./pages/Profil'));
const Kurikulum = lazy(() => import('./pages/Kurikulum'));
const Alumni = lazy(() => import('./pages/Alumni'));
const Penelitian = lazy(() => import('./pages/Penelitian'));
const Sejarah = lazy(() => import('./pages/Sejarah'));
const Visi = lazy(() => import('./pages/Visi'));
const Tujuan = lazy(() => import('./pages/Tujuan'));
const ProfilLulusan = lazy(() => import('./pages/ProfilLulusan'));
const CPL = lazy(() => import('./pages/CPL'));
const MataKuliah = lazy(() => import('./pages/MataKuliah'));
const DataMahasiswa = lazy(() => import('./pages/DataMahasiswa'));
const LayananAkademik = lazy(() => import('./pages/LayananAkademik'));
const DataAlumni = lazy(() => import('./pages/DataAlumni'));
const TracerStudy = lazy(() => import('./pages/TracerStudy'));
const Berita = lazy(() => import('./pages/Berita'));
const DetailBerita = lazy(() => import('./pages/DetailBerita'));

// Admin Pages
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ManageNews = lazy(() => import('./pages/admin/ManageNews'));
const ManageLecturers = lazy(() => import('./pages/admin/ManageLecturers'));
const ManageStudents = lazy(() => import('./pages/admin/ManageStudents'));
const ManageAlumni = lazy(() => import('./pages/admin/ManageAlumni'));
const ManagePublications = lazy(() => import('./pages/admin/ManagePublications'));
const ManageExams = lazy(() => import('./pages/admin/ManageExams'));

import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

import './App.css';

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400">
    <Loader2 className="animate-spin mb-4 text-primary-600" size={40} />
    <p className="font-bold uppercase tracking-widest text-xs">Memuat Halaman...</p>
  </div>
);

function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col font-sans">
        {!isAdminPath && <Navbar />}
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/berita" element={<Berita />} />
              <Route path="/berita/:id" element={<DetailBerita />} />
              
              {/* Profil Group */}
              <Route path="/profil" element={<Profil />} />
              <Route path="/profil/sejarah" element={<Sejarah />} />
              <Route path="/profil/visi" element={<Visi />} />
              <Route path="/profil/tujuan" element={<Tujuan />} />
              <Route path="/profil/lulusan" element={<ProfilLulusan />} />
              
              {/* Kurikulum Group */}
              <Route path="/kurikulum" element={<Kurikulum />} />
              <Route path="/kurikulum/cpl" element={<CPL />} />
              <Route path="/kurikulum/matakuliah" element={<MataKuliah />} />
              
              {/* Akademik & Riset */}
              <Route path="/dosen" element={<Dosen />} />
              <Route path="/penelitian" element={<Penelitian />} />
              
              {/* Mahasiswa Group */}
              <Route path="/mahasiswa" element={<Mahasiswa />} />
              <Route path="/mahasiswa/data" element={<DataMahasiswa />} />
              <Route path="/mahasiswa/layanan" element={<LayananAkademik />} />
              
              {/* Alumni Group */}
              <Route path="/alumni" element={<Alumni />} />
              <Route path="/alumni/data" element={<DataAlumni />} />
              <Route path="/alumni/tracer-study" element={<TracerStudy />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="news" element={<ManageNews />} />
                <Route path="lecturers" element={<ManageLecturers />} />
                <Route path="students" element={<ManageStudents />} />
                <Route path="alumni" element={<ManageAlumni />} />
                <Route path="publications" element={<ManagePublications />} />
                <Route path="exams" element={<ManageExams />} />
              </Route>

              {/* Catch all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
        {!isAdminPath && <Footer />}
      </div>
    </LazyMotion>
  );
}

export default App;
