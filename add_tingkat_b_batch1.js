const fs = require('fs');
let data;
try {
  data = JSON.parse(fs.readFileSync('grammar-units.json', 'utf8'));
} catch(e) { process.exit(1); }

const updates = [
  {
    unit: 17, // Used to
    questions: [
      { id: 'u17-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I ___ play tennis a lot, but I don\'t play very much now.', options: ['used to', 'am used to'], answer_index: 0, explanation: '"Used to + V1" menyatakan kebiasaan di masa lampau yang sekarang sudah berhenti.' },
      { id: 'u17-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: '___ (you/use) to eat a lot of sweets when you were a child?', accepted_answers: ['Did you use'], explanation: 'Dalam kalimat tanya, kita menggunakan "Did + subjek + use to" (tanpa huruf d).' },
      { id: 'u17-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "I used to getting up early."', options: ['I am used to getting up early.', 'I used to get up early.'], answer_index: 1, explanation: 'Karena ini membicarakan kebiasaan masa lampau, gunakan "used to + V1" (get up). Jika bermakna "sudah terbiasa saat ini", baru gunakan "am used to getting up".' }
    ]
  },
  {
    unit: 18, // Present tenses for the future
    questions: [
      { id: 'u18-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'What time ___ the train leave tomorrow?', options: ['does', 'will'], answer_index: 0, explanation: 'Jadwal resmi (kereta, pesawat, bioskop) SELALU menggunakan Present Simple, meskipun untuk masa depan.' },
      { id: 'u18-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I ___ (meet) my friends this evening. We arranged it yesterday.', accepted_answers: ['am meeting', "'m meeting"], explanation: 'Rencana pribadi yang sudah diatur pasti (fixed arrangement) menggunakan Present Continuous.' },
      { id: 'u18-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which indicates a personal arrangement already made?', options: ['I will see the doctor tomorrow.', 'I am seeing the doctor tomorrow.'], answer_index: 1, explanation: '"Am seeing" berarti janji temu (appointment) sudah dibuat dengan dokternya.' }
    ]
  },
  {
    unit: 19, // Going to
    questions: [
      { id: 'u19-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I have decided not to stay here any longer. I ___ look for somewhere else to live.', options: ['am going to', 'will'], answer_index: 0, explanation: 'Niat yang sudah diputuskan SEBELUM berbicara menggunakan "going to".' },
      { id: 'u19-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I felt really tired last night. I ___ (go) to bed early, but I had to finish my work.', accepted_answers: ['was going to'], explanation: 'Niat di masa lalu yang gagal dilaksanakan menggunakan "was/were going to".' },
      { id: 'u19-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Why is "going to" used here: "Look at the time! We are going to be late!"', options: ['It is a personal arrangement.', 'It is a prediction based on present evidence.'], answer_index: 1, explanation: 'Kita memakai "going to" karena ada bukti nyata saat ini (waktu yang sudah mepet).' }
    ]
  },
  {
    unit: 26, // Can, could, be able to
    questions: [
      { id: 'u26-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I can\'t sleep recently. = I haven\'t ___ sleep recently.', options: ['been able to', 'could'], answer_index: 0, explanation: '"Can" tidak memiliki bentuk Perfect. Kita harus memakai "been able to".' },
      { id: 'u26-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I looked everywhere for the book, but I ___ (not/find) it.', accepted_answers: ["couldn't", "could not"], explanation: 'Kemampuan secara umum di masa lampau (negatif).' },
      { id: 'u26-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which is correct for a SPECIFIC achievement in the past?', options: ['The fire spread quickly, but everybody could escape.', 'The fire spread quickly, but everybody managed to escape (or was able to escape).'], answer_index: 1, explanation: 'Untuk keberhasilan lolos dari kesulitan spesifik di masa lampau, JANGAN gunakan "could". Gunakan "managed to" atau "was/were able to".' }
    ]
  },
  {
    unit: 37, // Can/Could/Would you...?
    questions: [
      { id: 'u37-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: '___ you open the door, please?', options: ['Could', 'May'], answer_index: 0, explanation: '"Could you..." adalah cara sopan untuk meminta seseorang melakukan sesuatu.' },
      { id: 'u37-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: '___ (I/have) a glass of water, please?', accepted_answers: ['Can I have', 'Could I have', 'May I have'], explanation: 'Meminta sesuatu untuk diri sendiri.' },
      { id: 'u37-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'What is the most polite way to ask for permission?', options: ['Do you mind if I sit here?', 'Can I sit here?'], answer_index: 0, explanation: '"Do you mind if..." sangat sopan dan formal.' }
    ]
  },
  {
    unit: 42, // Passive 1
    questions: [
      { id: 'u42-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'This house ___ in 1930.', options: ['was built', 'built'], answer_index: 0, explanation: 'Rumah tersebut "dibangun" (pasif), bukan membangun dirinya sendiri.' },
      { id: 'u42-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'Cheese ___ (make) from milk.', accepted_answers: ['is made'], explanation: 'Fakta umum (Present Simple pasif).' },
      { id: 'u42-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "The room cleans every day."', options: ['The room is cleaned every day.', 'The room has cleaned every day.'], answer_index: 0, explanation: 'Ruangan dibersihkan (pasif). Karena every day, gunakan Present Simple (is cleaned).' }
    ]
  },
  {
    unit: 49, // Questions 1
    questions: [
      { id: 'u49-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'Who ___ this window?', options: ['broke', 'did break'], answer_index: 0, explanation: 'Jika "Who" berfungsi sebagai SUBJEK yang dicari, JANGAN gunakan do/does/did.' },
      { id: 'u49-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: '___ (What/happen) yesterday?', accepted_answers: ['What happened'], explanation: '"What" adalah subjek kalimat, langsung diikuti kata kerja.' },
      { id: 'u49-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which question is correct?', options: ['Who did you meet at the party?', 'Who you met at the party?'], answer_index: 0, explanation: 'Jika "Who" adalah OBJEK (siapa yang kamu temui), maka do/does/did WAJIB dipakai.' }
    ]
  },
  {
    unit: 51, // Auxiliary verbs
    questions: [
      { id: 'u51-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: '"I like classical music." - "___ do I."', options: ['So', 'Neither'], answer_index: 0, explanation: '"So" merespons setuju pada kalimat positif.' },
      { id: 'u51-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: '"I don\'t like loud music." - "___ do I."', accepted_answers: ['Neither', 'Nor'], explanation: '"Neither" merespons setuju pada kalimat negatif.' },
      { id: 'u51-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which is correct? "I haven\'t got a car."', options: ['Neither have I.', 'Neither do I.'], answer_index: 0, explanation: 'Kata bantu (auxiliary) harus menyesuaikan kalimat asli. "Haven\'t got" menggunakan "have".' }
    ]
  },
  {
    unit: 52, // Question tags
    questions: [
      { id: 'u52-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'You haven\'t seen Mary today, ___?', options: ['have you', 'haven\'t you'], answer_index: 0, explanation: 'Kalimat negatif diakhiri dengan tag positif.' },
      { id: 'u52-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'It was a good film, ___ it?', accepted_answers: ["wasn't"], explanation: 'Kalimat positif diakhiri dengan tag negatif.' },
      { id: 'u52-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Choose the correct tag: "Let\'s go for a walk, ___?"', options: ['shall we', 'will you'], answer_index: 0, explanation: 'Pengecualian khusus: Tag untuk "Let\'s..." SELALU "shall we?".' }
    ]
  },
  {
    unit: 53, // Verb + -ing
    questions: [
      { id: 'u53-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I don\'t mind ___ late.', options: ['working', 'to work'], answer_index: 0, explanation: 'Kata "mind" selalu diikuti Verb-ing.' },
      { id: 'u53-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'Suddenly everybody stopped ___ (talk).', accepted_answers: ['talking'], explanation: 'Kata "stop" dikuti -ing jika berarti berhenti melakukan aktivitas tersebut.' },
      { id: 'u53-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which verb CANNOT be followed by -ing?', options: ['decide', 'enjoy'], answer_index: 0, explanation: '"Decide" selalu diikuti "to" (decide to do). "Enjoy" selalu diikuti "-ing".' }
    ]
  },
  {
    unit: 54, // Verb + to
    questions: [
      { id: 'u54-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'We decided ___ a taxi.', options: ['to take', 'taking'], answer_index: 0, explanation: '"Decide" diikuti oleh "to + infinitive".' },
      { id: 'u54-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I promised ___ (not/be) late.', accepted_answers: ['not to be'], explanation: 'Bentuk negatif adalah "not to + verb".' },
      { id: 'u54-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "They seem being very happy."', options: ['They seem to be very happy.', 'They seem be very happy.'], answer_index: 0, explanation: '"Seem" selalu diikuti "to be".' }
    ]
  },
  {
    unit: 55, // Verb + object + to
    questions: [
      { id: 'u55-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I want ___ early.', options: ['you to come', 'that you come'], answer_index: 0, explanation: 'Pola yang benar adalah "want + object (you) + to + infinitive".' },
      { id: 'u55-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'She told me ___ (not/wait) for her.', accepted_answers: ['not to wait'], explanation: '"Tell somebody not to do something".' },
      { id: 'u55-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which sentence is grammatically INCORRECT?', options: ['I suggest you to go to the doctor.', 'I advise you to go to the doctor.'], answer_index: 0, explanation: '"Suggest" TIDAK PERNAH bisa menggunakan pola "suggest somebody to do something". Harus "suggest that..." atau "suggest -ing".' }
    ]
  },
  {
    unit: 58, // Prefer and would rather
    questions: [
      { id: 'u58-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I prefer tea ___ coffee.', options: ['than', 'to'], answer_index: 1, explanation: 'Pasangan untuk "prefer noun" adalah "to".' },
      { id: 'u58-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I\'d rather ___ (stay) at home tonight than go out.', accepted_answers: ['stay'], explanation: '"Would rather" langsung diikuti oleh kata kerja dasar (bare infinitive) tanpa "to".' },
      { id: 'u58-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'What does this mean: "I\'d rather you didn\'t tell anyone."', options: ['I prefer that you don\'t tell anyone.', 'I didn\'t want you to tell anyone in the past.'], answer_index: 0, explanation: '"Would rather somebody DID something" artinya pembicara ingin orang itu melakukannya SEKARANG/NANTI. (Past tense di sini bermakna pengandaian).' }
    ]
  },
  {
    unit: 59, // Preposition (in/for/about) + -ing
    questions: [
      { id: 'u59-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'Are you interested ___ working for us?', options: ['in', 'about'], answer_index: 0, explanation: 'Pasangan preposisi yang tepat adalah "interested IN".' },
      { id: 'u59-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I am not very good ___ (learn) languages.', accepted_answers: ['at learning'], explanation: 'Kata sifat "good" dan "bad" dipasangkan dengan preposisi "AT", dan selalu diikuti -ing.' },
      { id: 'u59-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "He left the hotel without pay his bill."', options: ['without paid his bill', 'without paying his bill'], answer_index: 1, explanation: '"Without" adalah preposisi, wajib diikuti oleh Verb-ing.' }
    ]
  },
  {
    unit: 60, // Be/get used to (Wait, unit 60 in Murphy is usually "To... and Preposition + -ing")
    questions: [
      { id: 'u60-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I went to the shop ___ some milk.', options: ['for to buy', 'to buy'], answer_index: 1, explanation: 'Untuk menyatakan tujuan/alasan melakukan sesuatu, langsung gunakan "to + infinitive".' },
      { id: 'u60-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I went to the shop ___ (for) some milk.', accepted_answers: ['for'], explanation: 'Jika diikuti oleh Noun (milk), gunakan "for", bukan "to".' },
      { id: 'u60-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which sentence is WRONG?', options: ['I went to London for learning English.', 'I went to London to learn English.'], answer_index: 0, explanation: 'Kita TIDAK BOLEH menggunakan "for -ing" untuk menyatakan tujuan perginya seseorang. "For -ing" hanya untuk menjelaskan fungsi alat (This knife is for cutting bread).' }
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
console.log('Tingkat B Batch 1 done!');
