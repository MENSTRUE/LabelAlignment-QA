# Panduan Integrasi Lokal — Windows PowerShell

[Indeks ID](README.md) · [English](../en/INTEGRATION_GUIDE.md) · [Backend](../../backend/README.md) · [Frontend](../../frontend/README.md)

## Prasyarat

Git, Python 3.11 yang kompatibel dengan dependensi, Node.js dan npm, driver NVIDIA (opsional untuk GPU), serta checkpoint **asli** `models/labelalignment_primary_best.pt`. Notebook penelitian berada di `notebooks/labelalignment-qa.ipynb`. Jangan menjalankan training untuk sekadar mengaktifkan aplikasi.

## Terminal 1 — Backend

```powershell
cd 'D:\porto\100 day\day 24\LabelAlignment QA\backend'
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m pip check
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Jika membutuhkan CUDA, pilih build PyTorch CUDA yang kompatibel dengan driver NVIDIA dan pasang pada `.venv` yang sama. Jangan memasang CPU wheel untuk mesin yang ditargetkan GPU tanpa alasan teknis. Cek lewat:

```powershell
.\.venv\Scripts\python.exe -c "import torch; print(torch.__version__, torch.version.cuda, torch.cuda.is_available()); print(torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU')"
```

**Perhatian:** CUDA tersedia ≠ API pasti menggunakan GPU. `detector.py` yang diaudit tidak memaksakan `device=0`, jadi ukur device sebenarnya sebelum mengklaim akselerasi HTTP.

## Terminal 2 — Frontend

```powershell
cd 'D:\porto\100 day\day 24\LabelAlignment QA\frontend'
Copy-Item .env.example .env -ErrorAction SilentlyContinue
npm ci
npm run dev
```

Frontend: `http://127.0.0.1:5173/` · API OpenAPI: `http://127.0.0.1:8000/docs`. Pastikan `frontend/.env` mengarah ke API di port 8000 sesuai `frontend/.env.example`.

## Uji integrasi yang dapat diulang

1. Buka frontend dan pastikan API connected; cek `GET /api/v1/health` untuk status checkpoint dan `GET /api/v1/model` untuk informasi model.
2. Unggah **gambar mentah tanpa bounding box** yang hak penggunaannya jelas; jalankan threshold 0,25 dan rekam waktu/model/kelas.
3. Uji gambar contoh teranotasi hanya sebagai smoke test teknis, bukan benchmark keakuratan.
4. Simpan JSON hasil aktual dan bandingkan dengan respons backend, bukan sekadar visualisasi.
5. Jalankan automated tests dan build:

```powershell
cd 'D:\porto\100 day\day 24\LabelAlignment QA\backend'
.\.venv\Scripts\python.exe -m pytest -q
cd ..\frontend
npm run build
```

## Troubleshooting

| Gejala | Pemeriksaan |
|---|---|
| `npm run dev` langsung berhenti | Jalankan `node -v`, `npm -v`, `npm ci`, lalu periksa error sebenarnya |
| API disconnected | Pastikan Uvicorn berjalan dan `frontend/.env` benar |
| `503` model | Pastikan checkpoint `.pt` tersedia pada path yang dibaca `backend/app/core/config.py` |
| Kelas tidak cocok | Pastikan `model.names` identik dengan ketiga nama kelas sumber |
| `0 detections` | Bisa merupakan hasil model yang valid; coba input mentah lain, periksa threshold, audit domain shift |
| CUDA terdeteksi tetapi lambat | Bandingkan cold/warm inference dan ukur device model yang benar, bukan hanya waktu request |
| `413` | Batas unggahan 10 MB pada konfigurasi backend |
| `422` | Periksa parameter `confidence` (0,05–0,95), `iou` (0,1–0,9), dan field multipart `file` |

## Keamanan dan deployment

Setup localhost ini untuk penelitian. Untuk publik: gunakan HTTPS/reverse proxy, origins CORS spesifik, rate limiting, autentikasi jika relevan, batas ukuran dan resolusi gambar, kebijakan retensi data, logging aman, dan pengujian beban. Jangan menyebarkan bobot/dataset sebelum memeriksa hak lisensi. Gunakan `README.md` root untuk roadmap dan batas klaim.
