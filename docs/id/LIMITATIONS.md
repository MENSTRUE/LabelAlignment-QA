# Keterbatasan, Batas Klaim, dan Kesiapan Rilis

[Indeks ID](README.md) · [English](../en/LIMITATIONS.md) · [Hasil primer](../../reports/primary_heldout_metrics.json)

## Sudah didukung oleh bukti

- Hasil evaluasi deteksi YOLOv8n di 35 gambar held-out dari sumber primer tercatat pada laporan.
- Frontend React dan API FastAPI berhasil berkomunikasi pada pengujian lokal yang dilaporkan pengguna; satu deteksi tampil pada contoh yang sudah diberi anotasi visual sebelumnya.
- PyTorch CUDA mendeteksi RTX 3050 Ti dalam tes langsung; inferensi terminal `.pt` pada contoh lokal menghasilkan satu deteksi `class_perfect label` dengan confidence ~0,8677.
- Ekspor ONNX terdaftar `status: ok` pada laporan riset; ini bukan bukti ekuivalensi hasil ekspor.

## Belum dibuktikan atau diimplementasikan

| Klaim | Status | Bukti yang dibutuhkan |
|---|---|---|
| Sudut label dalam derajat | **Tidak tersedia** | Keypoint/kontur, kalibrasi dan validasi nilai acuan |
| Offset label dalam mm atau piksel terkalibrasi | **Tidak tersedia** | Geometri botol acuan, skala, kontrol perspektif |
| PASS/FAIL terhadap spesifikasi pabrik | **Tidak tersedia** | Toleransi pabrik, dataset QA berlabel, kajian false reject/accept |
| Kinerja pada semua merek botol | **Tidak tervalidasi** | Dataset eksternal dan metrik per domain |
| Tidak ada data leakage | **Belum terbukti** | Review manual 26 kandidat visual lintas split |
| Backend HTTP memakai GPU | **Belum diukur eksplisit** | Telemetri device di request dan benchmark warm/cold |
| Kesetaraan ONNX dan PyTorch | **Belum diverifikasi** | Uji pasangan input, output, NMS, toleransi numerik |
| Keamanan aplikasi produksi | **Belum diaudit** | Auth, rate limiting, HTTPS, logging, security tests |

## Keterbatasan statistik dan dataset

Training primer berasal dari 210 gambar; hanya 35 masuk final held-out. Dataset sumber memiliki ketimpangan jumlah anotasi; gambar mirip dari proses pengambilan yang sama dapat menaikkan estimasi kualitas. dHash mengidentifikasi kandidat kemiripan, bukan ground truth duplikasi. mAP50 0,9870 tidak boleh dijelaskan sebagai "98,7% botol sempurna" atau jaminan kepatuhan standar industri.

## Risiko implementasi

Checkpoint bobot tidak tercantum sebagai file pada tree GitHub ketika audit dilakukan; pemakai harus memperoleh checkpoint dari output riset asli dengan izin yang sesuai. Aplikasi saat ini menyimpan inferensi sebagai respons browser, bukan sistem audit historis produksi. Ukuran/jenis gambar dibatasi backend, tetapi penggunaan di internet publik membutuhkan kontrol tambahan dan kebijakan privasi.

## Kebijakan klaim publik

**Boleh:** "YOLOv8n research prototype untuk mendeteksi tiga kelas anotasi kondisi label botol pada dataset sumber; hasil held-out tercatat dan antarmuka inferensi lokal telah diuji." **Tidak boleh:** "mengukur ketegakan label", "siap produksi", "99% akurat di pabrik", "tidak ada leakage", atau "setiap request pasti memakai GPU" tanpa bukti tambahan.

![Contoh hasil riset, bukan sertifikasi pabrik](../../assets/plots/heldout_predictions.png)

**Readiness:** prototype portofolio yang berfungsi pada contoh yang diuji; belum tersertifikasi sebagai inspeksi manufaktur. Prioritas berikutnya: gambar mentah baru, audit near-duplicate, verifikasi CUDA pada API, benchmark, dan dataset eksternal.
