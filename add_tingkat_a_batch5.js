const fs = require('fs');
let data;
try {
  data = JSON.parse(fs.readFileSync('grammar-units.json', 'utf8'));
} catch(e) { process.exit(1); }

const updates = [
  {
    unit: 46, // Have something done
    questions: [
      { id: 'u46-m-1', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I didn\'t cut my hair myself. I ___ (have/it/cut).', accepted_answers: ['had it cut'], explanation: 'Struktur: have + object + past participle (V3).' },
      { id: 'u46-m-2', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'We ___ at the moment.', options: ['are painting the house', 'are having the house painted'], answer_index: 1, explanation: 'Karena menyewa orang lain untuk mengecat, gunakan "are having [object] painted".' },
      { id: 'u46-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Difference in meaning: "She had her car repaired" vs "She repaired her car".', options: ['She did it herself in the second sentence.', 'They mean the exact same thing.'], answer_index: 0, explanation: '"She repaired her car" berarti dia melakukannya sendiri. "Had her car repaired" berarti dia menyuruh mekanik.' },
      { id: 'u46-h-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Change to "have something done": "Somebody stole my bag." -> "I ___."', accepted_answers: ['had my bag stolen'], explanation: 'Struktur ini juga bisa dipakai untuk kejadian buruk yang menimpa seseorang (mengalami sesuatu yang dicuri).' }
    ]
  },
  {
    unit: 47, // Reported speech 1
    questions: [
      { id: 'u47-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'Direct: "I am tired." -> Reported: He said that he ___ tired.', options: ['is', 'was'], answer_index: 1, explanation: 'Karena kalimat pengantar lampau ("said"), tenses bergeser mundur (am -> was).' },
      { id: 'u47-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'Direct: "I can\'t come." -> Reported: She said she ___ (cannot) come.', accepted_answers: ["couldn't", "could not"], explanation: '"Can" berubah menjadi "could" dalam reported speech.' },
      { id: 'u47-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'If the situation is STILL true, which is acceptable?', options: ['Tom said New York is more lively than London.', 'Tom said New York was more lively than London.', 'Both are acceptable.'], answer_index: 2, explanation: 'Jika faktanya masih benar sampai sekarang, tenses boleh bergeser (was) atau tetap (is).' },
      { id: 'u47-h-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Direct: "I will call you." -> Reported: He promised that he ___ (will) call me.', accepted_answers: ['would'], explanation: '"Will" selalu bergeser menjadi "would" jika melaporkan pembicaraan lampau.' }
    ]
  },
  {
    unit: 48, // Reported speech 2
    questions: [
      { id: 'u48-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'He ___ me that he was tired.', options: ['said', 'told'], answer_index: 1, explanation: '"Tell" (told) wajib diikuti oleh objek/orang (me/you/him). "Say" (said) tidak langsung diikuti orang.' },
      { id: 'u48-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'She ___ (say) that she didn\'t like the food.', accepted_answers: ['said'], explanation: 'Karena tidak menyebutkan KEPADA SIAPA dia bicara, gunakan "said".' },
      { id: 'u48-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Direct: "Please stay." -> Reported: She ___ stay.', options: ['told him to', 'said him to'], answer_index: 0, explanation: 'Melaporkan instruksi/permintaan menggunakan "tell somebody TO do something".' },
      { id: 'u48-h-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Direct: "Don\'t wait." -> Reported: He told us ___ (not/wait).', accepted_answers: ['not to wait'], explanation: 'Instruksi negatif dilaporkan dengan "told somebody NOT TO do something".' }
    ]
  },
  {
    unit: 50, // Indirect questions
    questions: [
      { id: 'u50-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'Direct: "Where is the post office?" -> Indirect: Do you know where ___.', options: ['is the post office?', 'the post office is?'], answer_index: 1, explanation: 'Dalam indirect question, urutannya kembali normal: subjek + verb.' },
      { id: 'u50-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'Direct: "What time did he leave?" -> Indirect: I don\'t know what time he ___ (leave).', accepted_answers: ['left'], explanation: 'Kata bantu "do/does/did" dihilangkan dalam indirect question.' },
      { id: 'u50-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which is correct?', options: ['I asked him how old was he.', 'I asked him how old he was.'], answer_index: 1, explanation: 'Ini adalah kalimat berita yang mengandung pertanyaan (reported question), strukturnya harus subjek + verb.' },
      { id: 'u50-h-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Direct: "Are you married?" -> Reported: She asked me ___ I was married.', accepted_answers: ['if', 'whether'], explanation: 'Pertanyaan Yes/No membutuhkan kata "if" atau "whether" saat diubah menjadi indirect/reported.' }
    ]
  },
  {
    unit: 56, // Verb + -ing or to (try, need, help)
    questions: [
      { id: 'u56-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'It was hot, so I tried ___ the window.', options: ['to open', 'opening'], answer_index: 1, explanation: 'Mencoba sebagai eksperimen ("coba deh buka jendelanya") menggunakan -ing. Kalau mencoba karena sulit, gunakan "to".' },
      { id: 'u56-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'This shirt needs ___ (wash).', accepted_answers: ['washing'], explanation: '"Need + -ing" bermakna pasif (baju ini perlu dicuci).' },
      { id: 'u56-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Meaning: "I tried to keep my eyes open, but I fell asleep."', options: ['I did an experiment.', 'I made an effort but it was difficult.'], answer_index: 1, explanation: '"Try to do" artinya berusaha keras melakukan sesuatu yang menantang.' },
      { id: 'u56-h-2', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "He needs to cut his hair." (meaning he needs someone to do it for him)', options: ['His hair needs cutting.', 'His hair needs to cut.'], answer_index: 0, explanation: 'Untuk benda mati yang memerlukan tindakan, gunakan "need + V-ing".' }
    ]
  },
  {
    unit: 57, // Verb + -ing or to (like / would like)
    questions: [
      { id: 'u57-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I like ___ the kitchen as often as possible.', options: ['cleaning', 'to clean'], answer_index: 1, explanation: '"Like to do" digunakan untuk kebiasaan yang kita anggap baik/benar, meskipun kita tidak menikmatinya (bukan hobi).' },
      { id: 'u57-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I would like ___ (go) to Japan next year.', accepted_answers: ['to go'], explanation: '"Would like" SELALU diikuti oleh "to + infinitive", bukan -ing.' },
      { id: 'u57-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'What does this mean: "I would like to have seen that movie."', options: ['I want to see it now.', 'I didn\'t see it, but I wish I had.'], answer_index: 1, explanation: '"Would like to have + V3" berarti penyesalan masa lalu (inginnya sih dulu melihat, tapi nyatanya tidak).' },
      { id: 'u57-h-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Complete the sentence: "I prefer driving ___ (than/to) travelling by train."', accepted_answers: ['to'], explanation: 'Pasangan untuk "prefer + V-ing" adalah "TO", bukan "than".' }
    ]
  },
  {
    unit: 61, // Be/get used to
    questions: [
      { id: 'u61-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I am used to ___ early.', options: ['wake up', 'waking up'], answer_index: 1, explanation: 'Setelah "be used to" (terbiasa dengan), "to" berfungsi sebagai preposisi sehingga kata kerjanya wajib -ing.' },
      { id: 'u61-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'It took me a long time to get used to ___ (drive) on the left.', accepted_answers: ['driving'], explanation: '"Get used to" (menjadi terbiasa) wajib diikuti Verb-ing.' },
      { id: 'u61-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which implies a past habit that no longer happens?', options: ['I used to live alone.', 'I am used to living alone.'], answer_index: 0, explanation: '"Used to + V1" adalah kebiasaan masa lampau. "Be used to + V-ing" artinya sudah terbiasa dengan sesuatu saat ini.' },
      { id: 'u61-h-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "He is used to work night shifts."', accepted_answers: ['working'], explanation: '"Is used to" harus diikuti oleh V-ing karena "to" adalah preposition di sini.' }
    ]
  },
  {
    unit: 66, // See somebody do and doing
    questions: [
      { id: 'u66-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I saw him ___ the road and disappear.', options: ['cross', 'crossing'], answer_index: 0, explanation: 'Jika kita melihat seluruh aksi dari awal sampai selesai (complete action), gunakan verb dasar (cross).' },
      { id: 'u66-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'As I drove past, I saw him ___ (wait) for a bus.', accepted_answers: ['waiting'], explanation: 'Melihat aksi yang sedang berlangsung di tengah-tengah (incomplete action) menggunakan -ing.' },
      { id: 'u66-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which sentence means I only heard a small part of the conversation?', options: ['I heard them talking.', 'I heard them talk.'], answer_index: 0, explanation: '"Talking" (-ing) berfokus pada aksi yang sedang berlangsung saat itu (belum selesai).' },
      { id: 'u66-h-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'I caught him ___ (read) my private diary.', accepted_answers: ['reading'], explanation: 'Kata kerja "catch" dan "find" (memergoki seseorang melakukan sesuatu) selalu diikuti oleh -ing.' }
    ]
  },
  {
    unit: 67, // -ing clauses (participle)
    questions: [
      { id: 'u67-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: '___ hard all day, I was very tired.', options: ['Working', 'Worked'], answer_index: 0, explanation: 'Klausa -ing (Working) menggantikan "Because I worked hard all day".' },
      { id: 'u67-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: '___ (Have) finished her work, she went home.', accepted_answers: ['Having'], explanation: '"Having + V3" digunakan untuk menekankan bahwa satu hal selesai sebelum hal lain terjadi.' },
      { id: 'u67-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which sentence is grammatically correct?', options: ['Walking across the road, my phone dropped.', 'Walking across the road, I dropped my phone.'], answer_index: 1, explanation: 'Subjek dari klausa -ing harus sama dengan subjek kalimat utama. Jika memilih opsi pertama, seolah-olah HP itu yang sedang menyeberang jalan.' },
      { id: 'u67-h-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "Not knew what to do, I called the police."', accepted_answers: ['Not knowing'], explanation: 'Bentuk negatif dari klausa -ing adalah "Not + V-ing".' }
    ]
  },
  {
    unit: 68, // Adjectives ending in -ing and -ed
    questions: [
      { id: 'u68-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'The movie was very ___.', options: ['bored', 'boring'], answer_index: 1, explanation: 'Sesuatu yang MEMBERIKAN efek menggunakan akhiran -ing.' },
      { id: 'u68-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I am not ___ (interest) in football.', accepted_answers: ['interested'], explanation: 'Perasaan yang DITERIMA seseorang menggunakan akhiran -ed.' },
      { id: 'u68-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Is it correct to say: "He is a boring person"?', options: ['Yes. It means he makes other people bored.', 'No. It should be "bored person".'], answer_index: 0, explanation: 'Orang juga bisa memakai -ing jika karakternya menyebabkan efek ke orang lain (dia membosankan).' },
      { id: 'u68-h-2', type: 'fill_blank', difficulty: 'hard', source: 'ai_generated', prompt: 'I was ___ (disappoint) with the test results.', accepted_answers: ['disappointed'], explanation: 'Menyatakan perasaan dari subjek "I".' }
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
