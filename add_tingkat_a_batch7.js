const fs = require('fs');
let data;
try {
  data = JSON.parse(fs.readFileSync('grammar-units.json', 'utf8'));
} catch(e) { process.exit(1); }

const updates = [
  {
    unit: 94, // Relative clauses 3
    questions: [
      { id: 'u94-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'An orphan is a child ___ parents are dead.', options: ['whose', 'who'], answer_index: 0, explanation: '"Whose" digunakan untuk menyatakan kepemilikan (anak yang ORANG TUANYA...).' },
      { id: 'u94-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I recently went back to the town ___ (where/which) I grew up.', accepted_answers: ['where'], explanation: 'Menggunakan "where" untuk tempat kejadian (di mana).' },
      { id: 'u94-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which sentence is more formal?', options: ['The woman who I fell in love with left me.', 'The woman with whom I fell in love left me.'], answer_index: 1, explanation: 'Dalam tulisan formal, preposisi (with) diletakkan di depan relative pronoun, dan pronounnya harus "whom".' },
      { id: 'u94-h-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the sentence: "I met a man who his brother knows you."', options: ['I met a man who brother knows you.', 'I met a man whose brother knows you.'], answer_index: 1, explanation: 'Kata ganti kepemilikan "his" harus dilebur dan diganti dengan "whose".' }
    ]
  },
  {
    unit: 95, // Relative clauses 4 (extra information)
    questions: [
      { id: 'u95-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'My brother Jim, ___ lives in London, is a doctor.', options: ['that', 'who'], answer_index: 1, explanation: 'Dalam Extra Information clause (diapit koma), kita TIDAK BOLEH menggunakan "that".' },
      { id: 'u95-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'We stayed at the Park Hotel, ___ (which) a friend of ours recommended.', accepted_answers: ['which'], explanation: 'Untuk benda (hotel) pada extra information clause, gunakan "which", bukan "that".' },
      { id: 'u95-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Difference in meaning: "My brother who lives in London is a doctor." vs "My brother, who lives in London, is a doctor."', options: ['The first implies I have more than one brother. The second implies I only have one brother.', 'No difference.'], answer_index: 0, explanation: 'Tanpa koma (defining) berarti informasi penting untuk membedakan dia dengan saudara saya yang lain.' },
      { id: 'u95-h-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Can we omit "who" in this sentence: "John, who I have known for years, is visiting today."?', options: ['Yes.', 'No.'], answer_index: 1, explanation: 'Dalam Extra Information clause (ditandai dengan koma), relative pronoun TIDAK PERNAH boleh dihilangkan.' }
    ]
  },
  {
    unit: 96, // Relative clauses 5
    questions: [
      { id: 'u96-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'Mary has three brothers, all of ___ are married.', options: ['whom', 'who'], answer_index: 0, explanation: 'Setelah preposisi (of/about/with), selalu gunakan "whom" (untuk manusia) atau "which" (benda).' },
      { id: 'u96-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I have read a lot of books, most of ___ (which) were boring.', accepted_answers: ['which'], explanation: 'Gunakan "which" untuk merujuk pada benda (books) setelah preposisi.' },
      { id: 'u96-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Complete: "He passed his exam, ___ surprised everybody."', options: ['which', 'that', 'what'], answer_index: 0, explanation: '"Which" di sini merujuk pada SELURUH kalimat sebelumnya (Fakta bahwa dia lulus), bukan merujuk pada ujiannya.' },
      { id: 'u96-h-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "They have a lot of money, some of that they give to charity."', options: ['some of which they give to charity.', 'some of whom they give to charity.'], answer_index: 0, explanation: 'Tidak boleh menggunakan "that" setelah preposisi (of). Gunakan "which" untuk benda (uang).' }
    ]
  },
  {
    unit: 97, // -ing and -ed clauses
    questions: [
      { id: 'u97-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'Do you know the woman ___ to Tom?', options: ['talking', 'talked'], answer_index: 0, explanation: '"Talking" adalah kependekan dari "who is talking" (yang sedang berbicara / aktif).' },
      { id: 'u97-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'The boy ___ (injure) in the accident was taken to hospital.', accepted_answers: ['injured'], explanation: '"Injured" adalah kependekan dari "who was injured" (yang terluka / pasif).' },
      { id: 'u97-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which sentence is grammatically correct?', options: ['The police have caught the men stealing the car.', 'The police have caught the men stolen the car.'], answer_index: 0, explanation: 'Para pria itu yang melakukan aksi pencurian (aktif), sehingga memakai -ing.' },
      { id: 'u97-h-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Most of the goods ___ (make) in this factory are exported.', accepted_answers: ['made'], explanation: 'Barang-barang "yang dibuat" (pasif), sehingga memakai bentuk Past Participle (V3).' }
    ]
  },
  {
    unit: 99, // Adjectives (order)
    questions: [
      { id: 'u99-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I bought a ___.', options: ['beautiful wooden table', 'wooden beautiful table'], answer_index: 0, explanation: 'Kata sifat opini (beautiful) selalu diletakkan sebelum fakta/material (wooden).' },
      { id: 'u99-m-2', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'He is a ___.', options: ['tall young man', 'young tall man'], answer_index: 0, explanation: 'Urutan kata sifat fakta: Ukuran (tall) dulu, baru Umur (young).' },
      { id: 'u99-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which is the correct order?', options: ['A large old rectangular wooden box', 'An old large wooden rectangular box'], answer_index: 0, explanation: 'Ukuran (large) -> Umur (old) -> Bentuk (rectangular) -> Material (wooden).' },
      { id: 'u99-h-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'She has long ___ (black) hair.', accepted_answers: ['black'], explanation: 'Ukuran/panjang (long) diletakkan sebelum Warna (black).' }
    ]
  },
  {
    unit: 109, // Word order 1 (verb and object)
    questions: [
      { id: 'u109-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'Which sentence is correct?', options: ['I speak very well English.', 'I speak English very well.'], answer_index: 1, explanation: 'Kata kerja (speak) dan Objek (English) tidak boleh dipisahkan oleh keterangan lain.' },
      { id: 'u109-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'Did you buy ___ (clothes/some/yesterday)? Type the exact order.', accepted_answers: ['some clothes yesterday'], explanation: 'Objek (some clothes) harus langsung mengikuti kata kerja (buy), lalu ditutup dengan keterangan waktu (yesterday).' },
      { id: 'u109-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which is the correct order for place and time?', options: ['We went yesterday to a party.', 'We went to a party yesterday.'], answer_index: 1, explanation: 'Keterangan Tempat (to a party) biasanya diletakkan sebelum Keterangan Waktu (yesterday).' },
      { id: 'u109-h-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Is this correct: "I read every morning the newspaper"?', options: ['Yes', 'No, it should be "I read the newspaper every morning"'], answer_index: 1, explanation: 'Objek (the newspaper) tidak boleh dipisah dari kata kerja (read).' }
    ]
  },
  {
    unit: 110, // Word order 2 (adverbs like always, also)
    questions: [
      { id: 'u110-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'Where do we put "always"?', options: ['I always go to work by bus.', 'I go always to work by bus.'], answer_index: 0, explanation: 'Adverb frekuensi diletakkan TEPAT SEBELUM kata kerja utama (go).' },
      { id: 'u110-m-2', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'Where do we put "always" with "To be"?', options: ['He always is late.', 'He is always late.'], answer_index: 1, explanation: 'Adverb diletakkan SETELAH to be (am/is/are/was/were).' },
      { id: 'u110-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Where do we put "probably" in a negative sentence?', options: ['I probably won\'t go.', 'I won\'t probably go.'], answer_index: 0, explanation: 'Dalam kalimat negatif, "probably" diletakkan SEBELUM kata bantu negatif (won\'t).' },
      { id: 'u110-h-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Complete: "They ___ (both/have) gone home."', accepted_answers: ['have both'], explanation: 'Jika kata kerjanya memiliki dua bagian (have gone), adverb diletakkan di tengah-tengahnya (setelah kata bantu).' }
    ]
  },
  {
    unit: 122, // On time / in time
    questions: [
      { id: 'u122-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'The train left ___ (sesuai jadwal).', options: ['on time', 'in time'], answer_index: 0, explanation: '"On time" berarti tepat pada waktu yang dijadwalkan (punctual/tidak telat).' },
      { id: 'u122-m-2', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I got home just ___ to watch the match on TV.', options: ['on time', 'in time'], answer_index: 1, explanation: '"In time" berarti dengan sisa waktu yang cukup untuk melakukan sesuatu / sebelum terlambat.' },
      { id: 'u122-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Difference: "At the end of the film..." vs "In the end, we went home..."', options: ['"At the end" is used for time/location limits. "In the end" means finally/after a long time.', 'No difference.'], answer_index: 0, explanation: '"At the end" wajib diikuti "of" (at the end of January). "In the end" digunakan sendiri sebagai kesimpulan cerita.' },
      { id: 'u122-h-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "In the end of the month, I will get paid."', accepted_answers: ['At the end'], explanation: 'Setiap merujuk pada titik batas waktu (of the month), selalu gunakan "At".' }
    ]
  }
];

let addedCount = 0;
for (const update of updates) {
  const unitObj = data.units.find(u => u.unit === update.unit);
  if (unitObj) {
    if (!unitObj.practice) unitObj.practice = { status: 'ready', questions: [] };
    if (!unitObj.practice.questions) unitObj.practice.questions = [];
    for (const q of update.questions) {
      if (!unitObj.practice.questions.find(eq => eq.id === q.id)) {
        unitObj.practice.questions.push(q);
        addedCount++;
      }
    }
  }
}
if (addedCount > 0) fs.writeFileSync('grammar-units.json', JSON.stringify(data, null, 2));
