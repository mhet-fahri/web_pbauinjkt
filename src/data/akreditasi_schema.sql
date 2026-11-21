-- Skrip pembuatan tabel akreditasi di Supabase (Opsional jika ingin multi-user tersinkronisasi di cloud)
-- Jalankan skrip ini di SQL Editor Supabase Anda jika ingin data tersimpan permanen di cloud database.

CREATE TABLE IF NOT EXISTS akreditasi_meta (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS akreditasi_items (
  no INT PRIMARY KEY,
  kriteria TEXT NOT NULL,
  elemen TEXT NOT NULL,
  indikator JSONB NOT NULL,
  bukti JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Buka policy baca untuk publik (asesor)
ALTER TABLE akreditasi_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE akreditasi_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-only access for meta" 
ON akreditasi_meta FOR SELECT USING (true);

CREATE POLICY "Allow public read-only access for items" 
ON akreditasi_items FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert/update for meta" 
ON akreditasi_meta FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert/update for items" 
ON akreditasi_items FOR ALL USING (auth.role() = 'authenticated');
