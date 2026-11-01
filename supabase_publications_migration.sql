-- =========================================================================
-- SQL Migration: Menambahkan kolom metadata untuk Integrasi Publikasi Ilmiah
-- Jalankan query ini di SQL Editor dashboard Supabase Anda
-- =========================================================================

-- 1. Tambahkan kolom pendukung di tabel publications_data jika belum ada
ALTER TABLE public.publications_data 
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS source text DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS citations integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS openalex_id text,
  ADD COLUMN IF NOT EXISTS lecturer_id bigint;

-- 2. Pastikan data yang sudah ada sebelumnya otomatis berstatus 'approved'
UPDATE public.publications_data 
SET status = 'approved' 
WHERE status IS NULL;

-- 3. Tambahkan index untuk mempercepat query status dan tahun
CREATE INDEX IF NOT EXISTS idx_publications_status ON public.publications_data(status);
CREATE INDEX IF NOT EXISTS idx_publications_year ON public.publications_data(year DESC);

