import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dosen from './pages/Dosen';
import Mahasiswa from './pages/Mahasiswa';
import Profil from './pages/Profil';
import Kurikulum from './pages/Kurikulum';
import Alumni from './pages/Alumni';
import Penelitian from './pages/Penelitian';
import Sejarah from './pages/Sejarah';
import Visi from './pages/Visi';
import Tujuan from './pages/Tujuan';
import ProfilLulusan from './pages/ProfilLulusan';
import CPL from './pages/CPL';
import MataKuliah from './pages/MataKuliah';
import DataMahasiswa from './pages/DataMahasiswa';
import LayananAkademik from './pages/LayananAkademik';
import DataAlumni from './pages/DataAlumni';
import TracerStudy from './pages/TracerStudy';
import Berita from './pages/Berita';
import DetailBerita from './pages/DetailBerita';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageNews from './pages/admin/ManageNews';
import ManageLecturers from './pages/admin/ManageLecturers';
import ManageStudents from './pages/admin/ManageStudents';
import ManageAlumni from './pages/admin/ManageAlumni';
import ManagePublications from './pages/admin/ManagePublications';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

import './App.css';

function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
      {!isAdminPath && <Navbar />}
      <main className="flex-grow">
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
          </Route>

          {/* Catch all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
    </div>
  );
}

export default App;
