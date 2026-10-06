# AGENTS.md

Proyek: website latihan grammar berdasarkan daftar isi English Grammar in Use (145 unit).
Tanpa framework dan tanpa dependensi. Data utama: `data/units.json`.

## Menjalankan
1. `python3 scripts/build.py` (validasi data dan hasilkan `data/units.js`)
2. `python3 -m http.server 8000`, lalu buka http://localhost:8000
   (atau buka `index.html` langsung di browser)

## Struktur
- `data/units.json`: sumber data (145 unit, penjelasan, soal). Edit file ini.
- `data/units.js`: hasil build. Jangan diedit manual.
- `data/schema.json`: skema data.
- `scripts/build.py`: validator dan generator.
- `index.html`: aplikasi (beranda, penjelasan unit, latihan, skor).
- `docs/`: tempat PDF buku (hanya rujukan, jangan di-commit jika tidak perlu).

## Aturan
- Semua unit sudah `ready` (6 soal per unit). Jangan ubah id unit atau id soal yang sudah ada.
- Soal dan penjelasan harus orisinal, ditulis dengan kata-kata sendiri. Jangan menyalin kalimat, latihan, atau teks penjelasan dari buku. PDF hanya dipakai untuk memahami topik per unit (lihat `pdf_pages`).
- Prompt `fill_blank` memakai `___`. Isi semua variasi jawaban sah di `accepted_answers`, termasuk bentuk singkat (misalnya 'm, 's).
- Setiap soal wajib punya `explanation` bahasa Indonesia yang singkat.
- Setelah mengubah data, jalankan `python3 scripts/build.py` sampai keluar "OK".

## Tugas (kerjakan berurutan)
1. Uji jalan: jalankan build, buka aplikasi, kerjakan Unit 1, pastikan skor tersimpan. Laporkan error jika ada.
2. Verifikasi isi: untuk tiap unit, baca halaman `pdf_pages.explanation` dan periksa `explanation` dan soal. Perbaiki yang keliru atau ambigu. Catat perubahan di `CHANGELOG.md`.
3. Perluas soal: tambah 2-4 soal per unit dengan `difficulty` "medium" atau "hard", `source` "ai_generated", id lanjutan (`uNNN-q7`, dst.). Kerjakan 5-10 unit per batch dan jalankan build tiap batch.
4. Tes campuran per bagian buku (field `sections` di `units.json`): ambil soal acak dari semua unit dalam satu bagian.
5. Fitur ulangi soal yang sering salah (simpan di localStorage), dengan jeda pengulangan bertahap.
