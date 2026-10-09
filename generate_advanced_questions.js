const fs = require('fs');
const path = require('path');

// ========================================================
// KONFIGURASI
// ========================================================
const API_KEY = process.env.GEMINI_API_KEY || 'REDACTED_API_KEY'; 
const START_UNIT = 1;
const END_UNIT = 145; 

// Nama file buku referensi Anda (pastikan file ini ada di folder yang sama)
const BOOK_FILENAME = 'book.pdf'; 

const filePath = path.join(__dirname, 'grammar-units.json');
let data;
try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
} catch (e) {
    console.error("Gagal membaca grammar-units.json");
    process.exit(1);
}

const delay = ms => new Promise(res => setTimeout(res, ms));

// Fungsi untuk mengunggah buku ke server memori Gemini
async function uploadBookToGemini(bookPath) {
  console.log(`\n⏳ Mengunggah buku referensi (${BOOK_FILENAME}) ke memori Gemini...`);
  console.log(`(Ini mungkin memakan waktu beberapa menit tergantung ukuran file)`);
  
  const fileStats = fs.statSync(bookPath);
  const fileContent = fs.readFileSync(bookPath);

  const response = await fetch(`https://generativelanguage.googleapis.com/upload/v1beta/files?key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'X-Goog-Upload-Protocol': 'raw',
      'X-Goog-Upload-Command': 'start, upload, finalize',
      'X-Goog-Upload-Header-Content-Length': fileStats.size.toString(),
      'X-Goog-Upload-Header-Content-Type': 'application/pdf',
      'Content-Type': 'application/pdf'
    },
    body: fileContent
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gagal mengunggah buku: ${response.status} ${errText}`);
  }

  const json = await response.json();
  console.log(`✅ Buku berhasil diunggah! URI: ${json.file.uri}`);
  
  // Memberi jeda waktu agar Gemini memproses PDF di latar belakang sebelum mulai ditanya
  console.log(`⏳ Menunggu 15 detik agar AI selesai memproses teks di dalam PDF...`);
  await delay(15000);
  
  return json.file.uri;
}

async function generateQuestionsForUnit(unit, bookFileUri) {
  const prompt = `Anda adalah seorang ahli pembuat kurikulum grammar bahasa Inggris berstandar internasional.
Tugas Anda adalah membuat 2 soal latihan tingkat menengah-sulit (Intermediate-Hard) HANYA untuk materi Unit ${unit.unit}: "${unit.title}".

SUMBER REFERENSI ANDA:
1. DOKUMEN UTAMA: File buku PDF yang dilampirkan (Fokus HANYA pada bab/materi yang membahas ${unit.title}).
2. RINGKASAN JSON KAMI:
   - Ringkasan: ${unit.explanation.summary}
   - Pola/Rumus: ${unit.explanation.pattern || 'Tidak ada'}

INSTRUKSI KETAT:
- Pelajari penjelasan lengkap dari buku PDF yang dilampirkan tentang materi Unit ${unit.unit} tersebut. Kombinasikan wawasan dari buku dengan RINGKASAN JSON di atas.
- DILARANG KERAS menggunakan vocab atau aturan grammar di luar ruang lingkup unit ini.
- Buat tepat 1 soal tipe "reorder" (menyusun kata).
- Buat tepat 1 soal tipe "error_correction" (memperbaiki kalimat salah).
- Hasil HANYA dalam format JSON object murni tanpa markdown, tanpa backticks (\`\`\`), atau kata pembuka/penutup.

FORMAT JSON OUTPUT:
{
  "enriched_summary": "Teks ringkasan materi yang sudah diperkaya dengan wawasan detail dari buku referensi, harus komprehensif dan mudah dipahami.",
  "enriched_pattern": "Pola/rumus grammar yang sudah diperjelas sesuai buku.",
  "new_examples": ["Contoh kalimat 1 langsung dari buku", "Contoh kalimat 2 langsung dari buku"],
  "questions": [
    {
      "id": "u${unit.unit}-adv-1",
      "type": "reorder",
      "difficulty": "hard",
      "source": "book_fusion",
      "prompt": "Rearrange the words to form a correct sentence based on the unit's pattern.",
      "words": ["array", "kata", "yang", "diacak"],
      "accepted_answers": ["kalimat utuh yang benar"],
      "explanation": "Penjelasan mendalam dalam bahasa Indonesia, gabungkan referensi dari buku."
    },
    {
      "id": "u${unit.unit}-adv-2",
      "type": "error_correction",
      "difficulty": "hard",
      "source": "book_fusion",
      "prompt": "Correct the error in this sentence: [Tulis kalimat bahasa inggris dengan 1 kesalahan tata bahasa spesifik terkait materi ini]",
      "accepted_answers": ["kalimat utuh yang benar tanpa error"],
      "explanation": "Penjelasan mendalam dalam bahasa Indonesia, gabungkan referensi dari buku."
    }
  ]
}`;

  const requestBody = {
    contents: [
      {
        parts: [
          { fileData: { mimeType: 'application/pdf', fileUri: bookFileUri } },
          { text: prompt }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2, 
      responseMimeType: "application/json" 
    }
  };

  let attempt = 0;
  const maxAttempts = 3;
  while (attempt < maxAttempts) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errText = await response.text();
        if (response.status === 503 || response.status === 429) {
          throw new Error(`API Sedang Sibuk (${response.status}). Menunggu 10 detik...`);
        }
        throw new Error(`API Error ${response.status}: ${errText}`);
      }

      const json = await response.json();
      if (!json.candidates || !json.candidates[0] || !json.candidates[0].content) {
        throw new Error(`Respons ditolak oleh sistem keamanan AI (Finish Reason: ${json.candidates?.[0]?.finishReason})`);
      }
      const rawText = json.candidates[0].content.parts[0].text;
      return JSON.parse(rawText);
    } catch (e) {
      attempt++;
      if (attempt >= maxAttempts || !e.message.includes('API Sedang Sibuk')) {
        throw e;
      }
      console.log(`      [!] Server Google sibuk. Mencoba ulang (${attempt}/${maxAttempts}) dalam 10 detik...`);
      await delay(10000); // Tunggu 10 detik sebelum coba lagi
    }
  }
}

async function run() {
  const bookPath = path.join(__dirname, BOOK_FILENAME);
  if (!fs.existsSync(bookPath)) {
      console.error(`\n❌ ERROR: Buku tidak ditemukan!`);
      console.error(`Harap pindahkan file PDF buku Anda ke folder ini dan beri nama "${BOOK_FILENAME}".`);
      process.exit(1);
  }

  console.log('🚀 Memulai Proses (PDF Book + JSON Fusion)...');
  
  let bookFileUri;
  try {
      bookFileUri = await uploadBookToGemini(bookPath);
  } catch (e) {
      console.error(e.message);
      process.exit(1);
  }

  console.log(`\n⚙️ Memproses Unit ${START_UNIT} hingga ${END_UNIT}...`);

  let addedCount = 0;

  for (const unit of data.units) {
    if (unit.unit < START_UNIT || unit.unit > END_UNIT) continue;

    console.log(`\n📚 Menganalisa Unit ${unit.unit}: ${unit.title}...`);
    
    const hasAdv = unit.practice.questions && unit.practice.questions.some(q => q.id.includes(`u${unit.unit}-adv`));
    if (hasAdv) {
      console.log(`   └─ Skip: Soal lanjutan sudah ada.`);
      continue;
    }
    
    try {
      const newContent = await generateQuestionsForUnit(unit, bookFileUri);
      
      // Update materi (JSON Fusion)
      if (newContent.enriched_summary) unit.explanation.summary = newContent.enriched_summary;
      if (newContent.enriched_pattern) unit.explanation.pattern = newContent.enriched_pattern;
      if (newContent.new_examples && newContent.new_examples.length > 0) {
          if (!unit.explanation.examples) unit.explanation.examples = [];
          unit.explanation.examples.push(...newContent.new_examples);
      }
      
      if (!unit.practice) unit.practice = { status: 'ready', questions: [] };
      if (!unit.practice.questions) unit.practice.questions = [];
      unit.practice.questions.push(...newContent.questions);
      
      console.log(`   └─ Sukses! Materi diperkaya & Ditambahkan ${newContent.questions.length} soal berbasis buku.`);
      addedCount += newContent.questions.length;
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      
      await delay(4000); 
    } catch (e) {
      console.error(`   └─ Gagal:`, e.message);
    }
  }

  console.log(`\n✅ Selesai! Berhasil menambahkan total ${addedCount} soal baru.`);
  console.log(`Silakan cek aplikasi Anda.`);
}

if (API_KEY === 'MASUKKAN_API_KEY_ANDA_DI_SINI') {
    console.error("\n❌ ERROR: API Key belum dimasukkan.");
    console.error("Buka file generate_advanced_questions.js dan ubah variabel API_KEY di baris ke-7.");
} else {
    run();
}
