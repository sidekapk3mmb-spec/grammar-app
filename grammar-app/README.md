# Latihan Grammar (English Grammar in Use, 145 unit)

## Menjalankan
1. `python3 scripts/build.py` (validasi `data/units.json`, hasilkan `data/units.js`)
2. Buka `index.html` di browser, atau jalankan `python3 -m http.server 8000` lalu buka http://localhost:8000

Tanpa dependensi. Progres belajar tersimpan di localStorage browser.

## Struktur
- `data/units.json`: sumber data utama (145 unit). Edit file ini, lalu jalankan build.
- `data/units.js`: hasil build, dibaca `index.html`. Jangan diedit manual.
- `data/schema.json`: JSON Schema untuk `units.json`.
- `scripts/build.py`: validator + generator.
- `index.html`: aplikasi (beranda, penjelasan unit, latihan, skor).

## Status soal
- `ready`: Unit 1-145, masing-masing 6 soal buatan manual.
- `starter`: tidak ada lagi. Semua 145 unit sudah `ready`. Soal bisa diperluas (8-10 per unit) memakai tugas di bawah.

## Tugas untuk agen (memperluas soal)
Untuk tiap unit berstatus `starter`:
1. Buka PDF buku pada `pdf_pages.explanation` dan `pdf_pages.exercises` untuk memahami topik.
2. Tulis 6-8 soal ORISINAL dengan kata-kata sendiri. Jangan menyalin kalimat, latihan, atau teks penjelasan buku.
3. Campur `multiple_choice` dan `fill_blank` (prompt fill_blank memakai `___`; isi semua variasi jawaban sah di `accepted_answers`, termasuk bentuk singkat seperti 'm).
4. Setiap soal wajib punya `explanation` singkat dalam bahasa Indonesia, `source: "ai_generated"`, id `uNNN-qK`.
5. Ubah `practice.status` menjadi `ready`, jalankan `python3 scripts/build.py`, perbaiki error sampai lolos.
Kerjakan 5-10 unit per batch.
