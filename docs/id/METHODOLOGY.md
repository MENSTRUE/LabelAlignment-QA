# Metodologi Riset dan Kontrak Inferensi

[Indeks ID](README.md) · [English](../en/METHODOLOGY.md) · [Notebook](../../notebooks/README.md)

## Pertanyaan penelitian

Apakah detektor objek dapat membedakan tiga kelas kondisi label botol sebagaimana didefinisikan dataset dan dipakai pada aplikasi web lokal? Pengukuran sudut, translasi label, atau toleransi manufaktur adalah tugas berbeda yang belum diverifikasi.

## Experiment 01 — Baseline terarsip

- **Sumber:** `label_v2`, 210 gambar; split group holdout 136/39/35; seed 42.
- **Detektor:** YOLOv8n/Ultralytics; kelas sumber 0–2 tidak boleh diurutkan ulang.
- **Training:** `reports/training_run.json` menyimpan Ultralytics 8.4.192 dan durasi ~90,18 detik pada lingkungan riset; nilai epoch atau argumen lain harus dibaca dari notebook, bukan diasumsikan.
- **Pemilihan model:** gunakan validation untuk memilih checkpoint `labelalignment_primary_best.pt`; test held-out dipakai hanya sebagai evaluasi akhir.
- **Metrik held-out:** precision 0,782705; recall 0,925798; mAP50 0,9870; mAP50–95 0,739511 pada 35 gambar.

| Kelas | AP50–95 held-out |
|---|---:|
| `class_imperfect label` | 0,793010 |
| `class_no label` | 0,746450 |
| `class_perfect label` | 0,679071 |

Angka berasal dari `reports/primary_heldout_metrics.json`, bukan dari demo frontend. AP per kelas tidak sama dengan akurasi klasifikasi botol. Jumlah sampel test kecil, sehingga hasil tidak boleh diekstrapolasi ke seluruh kondisi pabrik.

![Hasil prediksi held-out](../../assets/plots/heldout_predictions.png)

## Alur aplikasi

`React/Vite (frontend/src/pages/Workbench.tsx)` → `POST /api/v1/detect` → `backend/app/services/images.py` (validasi dan dekode) → `backend/app/inference/detector.py` (load YOLO `.pt`, inference, NMS) → respons JSON berisi kelas, confidence, xyxy dan pratinjau JPEG → visualisasi frontend. Status tersedia pada `GET /api/v1/health` dan `GET /api/v1/model`; kode sumber menjadi acuan kontrak terkini.

Checkpoint lokal diarahkan oleh `backend/app/core/config.py` ke `models/labelalignment_primary_best.pt`. Model dimuat *lazy*, dan guard wajib menolak urutan kelas yang berubah. Inference default dalam kode memakai `imgsz=640`, max 25 deteksi, dan confidence/IoU via query. Backend saat audit tidak meneruskan argumen `device=0` secara eksplisit; terdeteksinya CUDA di terminal belum menjamin permintaan browser memakai GPU.

## ONNX dan kontrak geometri

`reports/onnx_export.json` mencatat ekspor ONNX `status=ok`, tetapi **uji kesetaraan output `.pt` vs `.onnx` tidak terdokumentasi** dan aplikasi belum memakai ONNX. `reports/geometry_contract.json` mewajibkan empat sudut label, sumbu botol, titik acuan, serta ukuran referensi untuk menurunkan angle/offset. YOLO AABB saat ini tidak menyediakan geometri tersebut; tidak ada keputusan PASS/FAIL otomatis.

## Reproduksi dan revisi

Jalankan notebook asli dari awal di Kaggle dengan mount dataset primer. Simpan metadata dependency, seed, hash split, checkpoint terpilih dan keluaran asli. Perbaikan mendatang **ditambahkan sebagai Experiment 02/03 di bagian bawah**; jangan menghapus Experiment 01, mengarang grafik atau mengganti test setelah melihat hasil.

## Kesalahan umum interpretasi

- Inference sukses hanya menunjukkan API/model bekerja pada input yang diuji, bukan jaminan prediksi benar.
- Hasil 0 deteksi pada gambar luar sumber tidak otomatis membuktikan bug; catat sebagai uji generalisasi dan tinjau perbedaan domain.
- Gambar `assets/examples/test_01.jpg` sudah mengandung kotak visualisasi lama; tidak cocok sebagai satu-satunya tes kualitas.
