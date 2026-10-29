# Dokumentasi Indonesia — LabelAlignment QA

> **Day 24 / 100 Days of Projects** · Prototype riset inspeksi label botol berbasis YOLOv8n, FastAPI, dan React. Bukan sistem inspeksi manufaktur tersertifikasi.

[Kembali ke README utama](../../README.md) · [English](../en/README.md) · [Indeks dokumentasi](../README.md)

## Ringkasan dan status

**Masalah nyata:** pemeriksaan label botol secara manual dapat tidak konsisten; deteksi visual membantu meninjau kondisi label, tetapi penilaian posisi/kekencengan toleransi pabrik memerlukan pengukuran yang berbeda. **Tujuan proyek saat ini:** mempelajari tiga kelas sesuai anotasi dataset, menyediakan inferensi gambar nyata melalui API dan antarmuka web, serta melaporkan keterbatasan penelitian secara transparan.

| Before | Now (29 Oktober 2026) | Next |
|---|---|---|
| Gambar beranotasi dari sumber publik dan tanpa aplikasi terpadu | YOLOv8n ditraining; laporan held-out tersimpan; API dan frontend dapat diuji lokal | Audit visual near-duplicate; tes gambar mentah dan data eksternal; hardening, benchmark, deployment |

**Bukti integrasi lokal:** screenshot pengguna menunjukkan browser mengirim gambar contoh yang sudah teranotasi dan menerima satu deteksi; ini adalah *smoke test*, bukan hasil uji akurasi pada gambar baru. CUDA PyTorch mendeteksi RTX 3050 Ti dalam tes terminal; permintaan GPU eksplisit di API belum diverifikasi.

## Panduan dokumentasi

| Dokumen | Fungsi |
|---|---|
| [DATASETS.md](DATASETS.md) | Sumber, lisensi, anotasi, split, kebocoran data |
| [METHODOLOGY.md](METHODOLOGY.md) | Training, seleksi model, metrik, inferensi dan kontrak API |
| [LIMITATIONS.md](LIMITATIONS.md) | Batas klaim dan kesiapan produksi |
| [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) | Setup Windows, pengujian dan troubleshooting |

**Source-of-truth:** `notebooks/labelalignment-qa.ipynb` adalah rekaman eksperimen; `reports/*.json` dan `reports/*.csv` menyimpan hasil terukur; `backend/` dan `frontend/` adalah implementasi aplikasi; gambar asli untuk dokumentasi tersimpan pada `assets/`. Angka dari split berbeda tidak boleh dicampur.

## Hasil utama pada dataset sumber

- **210 gambar** inventaris primer; **136 train / 39 validation / 35 test**, seed 42.
- **Precision 0,7827; recall 0,9258; mAP50 0,9870; mAP50–95 0,7395** pada 35 gambar held-out, sesuai `reports/primary_heldout_metrics.json`.
- **26 pasangan kandidat near-duplicate lintas split** berdasarkan dHash; belum menjadi bukti kebocoran pasti maupun bukti dataset bebas kebocoran.
- **Geometri sudut/offset label belum diukur**; keputusan PASS/FAIL manufaktur tidak diberikan.

## Galeri hasil asli

![Contoh ground truth dari dataset](../../assets/plots/ground_truth_examples.png)

![Prediksi held-out](../../assets/plots/heldout_predictions.png)

![Sebaran split](../../assets/plots/split_counts.png)

![Kandidat kemiripan visual](../../assets/plots/near_duplicate_review.png)

![Contoh inferensi lokal yang sebelumnya sudah beranotasi](../../assets/examples/gpu_test_result.jpg)

![Antarmuka inspeksi lokal](../../assets/screenshots/Screenshot%202026-10-29%20212808.png)

**Penting:** `assets/examples/test_01.jpg` telah memiliki visualisasi anotasi; jangan digunakan sebagai satu-satunya bukti generalisasi model. Gambar demonstrasi bukan sampel uji baru independen.

## Struktur dan navigasi

Repo memiliki `notebooks/`, `models/`, `reports/`, `assets/`, `backend/`, `frontend/`, `docs/`, `scripts/`. Folder `app/` lama yang masih ada di branch utama berisi placeholder; jangan dianggap implementasi aplikasi. [README root](../../README.md) berisi struktur lebih lengkap. Semua perubahan struktur wajib mengikuti `AGENTS.md`.

## Reproduksibilitas, hak cipta, dan pengembangan

Gunakan sumber Kaggle primer yang disebut di DATASETS, periksa versi dataset dan hak distribusi secara mandiri, dan jalankan notebook di Kaggle dengan mount yang benar. Jangan mengunggah dataset mentah atau checkpoint tanpa pemeriksaan izin sumber. Kode dilisensikan MIT melalui [LICENSE](../../LICENSE); lisensi dataset dan bobot turunan perlu diverifikasi terpisah. Deployment publik hanya boleh setelah pengujian API, pembatasan ukuran input, pengamanan CORS, dan pemeriksaan privasi gambar.

## Pertanyaan umum

**Apakah mAP50 98,7% berarti 98,7% botol lolos inspeksi?** Tidak; mAP adalah metrik deteksi, bukan yield pabrik. **Apakah ONNX sudah dipakai web?** Belum: backend sekarang memanggil checkpoint `.pt`. **Mengapa gambar dari internet bisa mendapat nol deteksi?** Domain shift atau ambang confidence; hasil nol adalah keluaran sah dan harus dicatat. **Di mana model?** `models/labelalignment_primary_best.pt` secara lokal; repo GitHub tidak menjamin bobot tersedia untuk diunduh.
