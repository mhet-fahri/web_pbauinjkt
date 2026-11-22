import { supabase } from '../lib/supabase';
import defaultItems from '../data/akreditasiDefault.json';

const LOCAL_STORAGE_KEY = 'pba_akreditasi_items_v1';
const LOCAL_STORAGE_LED_KEY = 'pba_akreditasi_led_v1';
const LOCAL_STORAGE_DKPS_KEY = 'pba_akreditasi_dkps_v1';
const LOCAL_STORAGE_RINGKASAN_KEY = 'pba_akreditasi_ringkasan_v1';

const DEFAULT_RINGKASAN_CONFIG = {
  title: 'Ringkasan Eksekutif LED PBA',
  subtitle: 'Ikhtisar Eksekutif Laporan Evaluasi Diri Program Studi Pendidikan Bahasa Arab',
  pdfUrl: '',
  lastUpdated: new Date().toISOString()
};

const DEFAULT_LED_CONFIG = {
  title: 'Laporan Evaluasi Diri (LED) PBA',
  subtitle: 'Dokumen Induk Akreditasi Program Studi Pendidikan Bahasa Arab - FITK UIN Syarif Hidayatullah Jakarta',
  pdfUrl: '', // Link Google Drive LED
  lastUpdated: new Date().toISOString()
};

const DEFAULT_DKPS_CONFIG = {
  title: 'Dokumen Kinerja Program Studi (DKPS)',
  subtitle: 'Data Kuantitatif Kinerja Program Studi Pendidikan Bahasa Arab (Format Excel Spreadsheet dengan Rumus Baku)',
  excelUrl: '', // Link Google Drive Excel/Spreadsheet DKPS atau Direct Download URL
  fileName: '', // Nama file excel yang diunggah
  lastUpdated: new Date().toISOString()
};

/**
 * Mengambil konfigurasi Ringkasan Eksekutif LED
 */
export async function getRingkasanConfig() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('akreditasi_meta')
        .select('*')
        .eq('key', 'ringkasan_config')
        .single();
      if (!error && data?.value) {
        return data.value;
      }
    } catch (err) {}
  }

  try {
    const local = localStorage.getItem(LOCAL_STORAGE_RINGKASAN_KEY);
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {
    console.error('Failed to read Ringkasan config from localStorage', e);
  }

  return DEFAULT_RINGKASAN_CONFIG;
}

/**
 * Menyimpan konfigurasi Ringkasan Eksekutif LED
 */
export async function saveRingkasanConfig(config) {
  const payload = {
    ...DEFAULT_RINGKASAN_CONFIG,
    ...config,
    lastUpdated: new Date().toISOString()
  };

  try {
    localStorage.setItem(LOCAL_STORAGE_RINGKASAN_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error('Failed to save Ringkasan config to localStorage', e);
  }

  if (supabase) {
    try {
      await supabase
        .from('akreditasi_meta')
        .upsert({ key: 'ringkasan_config', value: payload }, { onConflict: 'key' });
    } catch (err) {}
  }

  return payload;
}

/**
 * Mengambil konfigurasi LED (Laporan Evaluasi Diri)
 */
export async function getLedConfig() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('akreditasi_meta')
        .select('*')
        .eq('key', 'led_config')
        .single();
      if (!error && data?.value) {
        return data.value;
      }
    } catch (err) {}
  }

  try {
    const local = localStorage.getItem(LOCAL_STORAGE_LED_KEY);
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {
    console.error('Failed to read LED config from localStorage', e);
  }

  return DEFAULT_LED_CONFIG;
}

/**
 * Mengambil konfigurasi DKPS (Dokumen Kinerja Program Studi)
 */
export async function getDkpsConfig() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('akreditasi_meta')
        .select('*')
        .eq('key', 'dkps_config')
        .single();
      if (!error && data?.value) {
        return data.value;
      }
    } catch (err) {}
  }

  try {
    const local = localStorage.getItem(LOCAL_STORAGE_DKPS_KEY);
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {
    console.error('Failed to read DKPS config from localStorage', e);
  }

  return DEFAULT_DKPS_CONFIG;
}

/**
 * Menyimpan konfigurasi LED
 */
export async function saveLedConfig(config) {
  const payload = {
    ...DEFAULT_LED_CONFIG,
    ...config,
    lastUpdated: new Date().toISOString()
  };

  try {
    localStorage.setItem(LOCAL_STORAGE_LED_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error('Failed to save LED config to localStorage', e);
  }

  if (supabase) {
    try {
      await supabase
        .from('akreditasi_meta')
        .upsert({ key: 'led_config', value: payload }, { onConflict: 'key' });
    } catch (err) {}
  }

  return payload;
}

/**
 * Menyimpan konfigurasi DKPS
 */
export async function saveDkpsConfig(config) {
  const payload = {
    ...DEFAULT_DKPS_CONFIG,
    ...config,
    lastUpdated: new Date().toISOString()
  };

  try {
    localStorage.setItem(LOCAL_STORAGE_DKPS_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error('Failed to save DKPS config to localStorage', e);
  }

  if (supabase) {
    try {
      await supabase
        .from('akreditasi_meta')
        .upsert({ key: 'dkps_config', value: payload }, { onConflict: 'key' });
    } catch (err) {}
  }

  return payload;
}

/**
 * Mengambil semua 65 elemen akreditasi (Menggabungkan data default 65 elemen dengan bukti dari DB/Storage)
 */
export async function getAkreditasiItems() {
  let savedItems = [];

  // 1. Ambil data dari Supabase jika ada
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('akreditasi_items')
        .select('*')
        .order('no', { ascending: true });
      if (!error && data && data.length > 0) {
        savedItems = data;
      }
    } catch (err) {
      // Abaikan jika Supabase offline
    }
  }

  // 2. Jika tidak ada di Supabase, cek localStorage
  if (savedItems.length === 0) {
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          savedItems = parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse akreditasi items from localStorage', e);
    }
  }

  // 3. MERGE CERDAS: Pastikan SELALU ada 65 elemen lengkap!
  // Kita buat map dari savedItems berdasarkan 'no'
  const savedMap = new Map();
  savedItems.forEach(item => {
    if (item && item.no) {
      savedMap.set(item.no, item);
    }
  });

  // Gabungkan dengan default 65 elemen
  const mergedItems = defaultItems.map(defaultItem => {
    const saved = savedMap.get(defaultItem.no);
    if (saved) {
      return {
        ...defaultItem,
        bukti: (saved.bukti && saved.bukti.length > 0) ? saved.bukti : defaultItem.bukti
      };
    }
    return defaultItem;
  });

  return mergedItems;
}

/**
 * Mengupdate satu butir akreditasi (bukti, nama, dsb.)
 */
export async function updateAkreditasiItem(no, updatedData) {
  const currentItems = await getAkreditasiItems();
  const index = currentItems.findIndex(item => item.no === no);

  if (index === -1) {
    throw new Error(`Item dengan No. ${no} tidak ditemukan`);
  }

  currentItems[index] = {
    ...currentItems[index],
    ...updatedData
  };

  // Simpan ke localStorage
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentItems));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }

  // Simpan ke Supabase jika ada
  if (supabase) {
    try {
      await supabase
        .from('akreditasi_items')
        .upsert({
          no: currentItems[index].no,
          kriteria: currentItems[index].kriteria,
          elemen: currentItems[index].elemen,
          indikator: currentItems[index].indikator,
          bukti: currentItems[index].bukti,
          updated_at: new Date().toISOString()
        }, { onConflict: 'no' });
    } catch (err) {
      // Abaikan jika Supabase offline / tabel belum dibuat
    }
  }

  return currentItems[index];
}

/**
 * Reset data ke default JSON awal (berguna jika admin ingin reset)
 */
export async function resetAkreditasiItemsToDefault() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultItems));
  return defaultItems;
}
