const fs = require('fs');
let data;
try {
  data = JSON.parse(fs.readFileSync('grammar-units.json', 'utf8'));
} catch(e) { process.exit(1); }

const updates = [
  {
    unit: 69, // Countable and uncountable 1
    questions: [
      { id: 'u69-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I\'m going to buy ___ bread.', options: ['a', 'some'], answer_index: 1, explanation: 'Bread adalah uncountable noun (tidak bisa dihitung). Tidak bisa memakai "a".' },
      { id: 'u69-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'Can you hear ___ (music)?', accepted_answers: ['music'], explanation: 'Music adalah uncountable noun, tidak boleh memakai awalan a/an.' },
      { id: 'u69-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which sentence is correct?', options: ['What a beautiful weather!', 'What beautiful weather!'], answer_index: 1, explanation: 'Weather adalah uncountable noun. Penggunaan "a weather" selalu salah.' },
      { id: 'u69-h-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Difference in meaning: "I bought a paper" vs "I bought some paper".', options: ['"A paper" means a newspaper. "Some paper" means material to write on.', 'They mean the exact same thing.'], answer_index: 0, explanation: 'Beberapa kata benda (paper, hair, room) bisa uncountable maupun countable tergantung maknanya.' }
    ]
  },
  {
    unit: 70, // Countable and uncountable 2 (accommodation, behaviour, news, etc)
    questions: [
      { id: 'u70-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I have some ___ to tell you.', options: ['news', 'newses'], answer_index: 0, explanation: '"News" sudah berbentuk singular uncountable, tidak bisa ditambah plural -es.' },
      { id: 'u70-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'They gave me some good ___ (advice).', accepted_answers: ['advice'], explanation: '"Advice" selalu uncountable. Tidak bisa menjadi advices.' },
      { id: 'u70-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which is correct?', options: ['The furniture in this room is beautiful.', 'The furnitures in this room are beautiful.'], answer_index: 0, explanation: '"Furniture" selalu uncountable. Selalu gunakan verb tunggal (is/was/has).' },
      { id: 'u70-h-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "He gave me a good advice."', options: ['He gave me some good advice.', 'He gave me an advice.'], answer_index: 0, explanation: '"Advice" tidak boleh memakai "a/an" karena tidak bisa dihitung. Gunakan "some" atau "a piece of".' }
    ]
  },
  {
    unit: 72, // A/an and the
    questions: [
      { id: 'u72-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'Can you turn off ___ light, please?', options: ['a', 'the'], answer_index: 1, explanation: 'Kita menggunakan "the" saat pembicara dan pendengar tahu benda mana yang dimaksud secara spesifik.' },
      { id: 'u72-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I\'d like to speak to ___ (manager), please.', accepted_answers: ['the manager'], explanation: 'Menggunakan "the" karena dalam konteks tersebut hanya ada satu manajer (spesifik).' },
      { id: 'u72-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which sentence means "I want any apple from the basket"?', options: ['Can I have an apple?', 'Can I have the apple?'], answer_index: 0, explanation: '"An apple" berarti tidak peduli apel yang mana pun. "The apple" berarti ada satu apel spesifik yang dimaksud.' },
      { id: 'u72-h-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Is this correct: "I took a taxi to the station."', options: ['Yes, it is correct.', 'No, it should be "the taxi".'], answer_index: 0, explanation: 'Menggunakan "a taxi" karena kita tidak peduli taksi mana yang dinaiki (tidak spesifik).' }
    ]
  },
  {
    unit: 73, // The 1
    questions: [
      { id: 'u73-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: '___ sun is a star.', options: ['Sun', 'The sun'], answer_index: 1, explanation: 'Kita menggunakan "the" untuk sesuatu yang hanya ada satu di alam semesta.' },
      { id: 'u73-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I like listening to ___ (radio).', accepted_answers: ['the radio'], explanation: 'Kata "radio" (sebagai sarana hiburan/komunikasi) selalu diikuti oleh "the".' },
      { id: 'u73-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which sentence is grammatically correct?', options: ['I watched television all evening.', 'I watched the television all evening.'], answer_index: 0, explanation: 'Kata "television" (sebagai acara siaran) TIDAK menggunakan "the". (Kecuali merujuk pada benda fisik televisinya).' },
      { id: 'u73-h-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "What did you have for the breakfast?"', options: ['What did you have for breakfast?', 'What did you have for a breakfast?'], answer_index: 0, explanation: 'Nama-nama waktu makan (breakfast, lunch, dinner) TIDAK menggunakan the/a/an.' }
    ]
  },
  {
    unit: 74, // The 2 (school / the school etc)
    questions: [
      { id: 'u74-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'Ken\'s brother is in ___ prison for robbery.', options: ['prison', 'the prison'], answer_index: 0, explanation: 'Untuk institusi (prison, hospital, school, university) tanpa the, berarti dia berada di sana sebagai narapidana/pasien/murid (tujuan aslinya).' },
      { id: 'u74-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I go to ___ (bed) at midnight.', accepted_answers: ['bed'], explanation: '"Go to bed" berarti pergi tidur. Tidak perlu "the".' },
      { id: 'u74-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Difference in meaning: "Ken is in prison" vs "Ken went to the prison".', options: ['The first means he is a prisoner. The second means he went there as a visitor.', 'No difference.'], answer_index: 0, explanation: 'Penambahan "the" (the prison) merujuk pada bangunan fisiknya, biasanya bagi pengunjung.' },
      { id: 'u74-h-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which is correct?', options: ['I finished university last year.', 'I finished the university last year.'], answer_index: 0, explanation: 'Merujuk pada institusi pendidikan secara umum (university) tidak membutuhkan "the".' }
    ]
  },
  {
    unit: 75, // The 3 (children / the children)
    questions: [
      { id: 'u75-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I love ___. They are amazing animals.', options: ['dogs', 'the dogs'], answer_index: 0, explanation: 'Berbicara tentang sesuatu secara UMUM (semua anjing) tidak perlu menggunakan "the".' },
      { id: 'u75-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: '___ (Apples) are good for you.', accepted_answers: ['Apples'], explanation: 'Kata benda jamak (plural) yang bermakna general tidak menggunakan the.' },
      { id: 'u75-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Difference: "I like listening to music" vs "I like the music".', options: ['"Music" is general music. "The music" means a specific song or track playing right now.', 'No difference.'], answer_index: 0, explanation: '"The" selalu merujuk pada benda atau kelompok spesifik yang sedang dibahas.' },
      { id: 'u75-h-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Rewrite correctly: "The life is complicated." -> "___ is complicated."', accepted_answers: ['Life'], explanation: '"Life" secara umum tidak memakai the.' }
    ]
  },
  {
    unit: 76, // The 4 (with names of places)
    questions: [
      { id: 'u76-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'They live in ___ United Kingdom.', options: ['United Kingdom', 'the United Kingdom'], answer_index: 1, explanation: 'Negara yang mengandung kata "Republic", "Kingdom", atau "States" selalu menggunakan "the".' },
      { id: 'u76-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I have never been to ___ (Africa).', accepted_answers: ['Africa'], explanation: 'Nama benua, negara tunggal, kota, atau desa TIDAK menggunakan the.' },
      { id: 'u76-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which of the following requires "the"?', options: ['Lake Victoria', 'Nile River (Nile)'], answer_index: 1, explanation: 'Nama sungai, laut, dan samudra memakai "the". Nama danau (Lake) TIDAK memakai "the".' },
      { id: 'u76-h-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which mountain needs "the"?', options: ['Mount Everest', 'Alps (pegunungan)'], answer_index: 1, explanation: 'Barisan/rangkaian pegunungan (The Alps, The Andes) memakai "the". Gunung tunggal (Mount Everest) tidak.' }
    ]
  },
  {
    unit: 87, // Much, many, little, few (Actually let's combine it with the general topics)
    questions: [
      { id: 'u87-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'We didn\'t spend ___ money.', options: ['many', 'much'], answer_index: 1, explanation: '"Money" adalah uncountable, jadi pasangannya adalah "much".' },
      { id: 'u87-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I feel sorry for her. She has ___ (little/few) friends.', accepted_answers: ['few'], explanation: '"Friends" bisa dihitung (countable), jadi gunakan "few" (sedikit/hampir tidak ada).' },
      { id: 'u87-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Difference: "He has a little money" vs "He has little money".', options: ['"A little" is positive (some). "Little" is negative (nearly none).', 'No difference.'], answer_index: 0, explanation: '"A little" (atau a few) bermakna positif "masih lumayan ada". Tanpa awalan "a", bermakna negatif (miris/kurang).' },
      { id: 'u87-h-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the sentence: "I have got a lot of works to do today."', accepted_answers: ['a lot of work'], explanation: '"Work" (pekerjaan) adalah uncountable noun, tidak boleh ditambahkan -s.' }
    ]
  },
  {
    unit: 90, // All and every
    questions: [
      { id: 'u90-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: '___ student in the class passed the exam.', options: ['All', 'Every'], answer_index: 1, explanation: '"Every" harus diikuti oleh kata benda singular (student). "All" diikuti kata benda plural (all students).' },
      { id: 'u90-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'It rained ___ (all/every) day yesterday.', accepted_answers: ['all'], explanation: '"All day" berarti sepanjang hari. "Every day" berarti setiap hari (rutin).' },
      { id: 'u90-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which sentence is grammatically correct?', options: ['All of cars have wheels.', 'All cars have wheels.'], answer_index: 1, explanation: 'Jika merujuk secara umum, tidak perlu kata "of". "All of" digunakan dengan kata ganti (all of them) atau spesifik (all of the cars here).' },
      { id: 'u90-h-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "Everybody have arrived."', options: ['Everybody has arrived.', 'All body have arrived.'], answer_index: 0, explanation: 'Kata ganti "Everybody", "Everyone", "Everything" SELALU dianggap tunggal (singular), sehingga memakai has/is/does.' }
    ]
  },
  {
    unit: 93, // Relative clauses 2
    questions: [
      { id: 'u93-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'Did you find the book ___ you were looking for?', options: ['who', 'which'], answer_index: 1, explanation: '"Book" adalah benda mati, sehingga relative pronoun-nya "which" atau "that".' },
      { id: 'u93-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'The woman ___ (who/which) lives next door is a doctor.', accepted_answers: ['who', 'that'], explanation: '"Woman" adalah manusia.' },
      { id: 'u93-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Can we OMIT (menghapus) the word "who" in this sentence: "The man who I saw yesterday is my uncle."?', options: ['Yes, we can.', 'No, we cannot.'], answer_index: 0, explanation: 'Jika relative pronoun (who/which/that) berfungsi sebagai OBJEK (saya melihat [dia]), maka kata tersebut boleh dihapus.' },
      { id: 'u93-h-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Can we OMIT "who" here: "The man who lives next door is my uncle."?', options: ['Yes, we can.', 'No, we cannot.'], answer_index: 1, explanation: 'Jika relative pronoun berfungsi sebagai SUBJEK (dia [tinggal di sebelah]), kata tersebut TIDAK BOLEH dihapus.' }
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
