const fs = require('fs');
let data;
try {
  data = JSON.parse(fs.readFileSync('grammar-units.json', 'utf8'));
} catch(e) { process.exit(1); }

const updates = [
  {
    unit: 62, // Preposition (in/for/about) + -ing
    questions: [
      { id: 'u62-m-1', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I locked the door before ___ (leave).', accepted_answers: ['leaving'], explanation: 'Setelah preposisi "before", kata kerja harus berbentuk -ing.' },
      { id: 'u62-m-2', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'He is thinking ___ buying a new car.', options: ['of', 'to'], answer_index: 0, explanation: '"Think" dipasangkan dengan preposisi "of" atau "about".' },
      { id: 'u62-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which is correct?', options: ['Instead of study, he played games.', 'Instead of studying, he played games.'], answer_index: 1, explanation: '"Instead of" adalah gabungan preposisi, wajib diikuti oleh Verb-ing.' }
    ]
  },
  {
    unit: 63, // To... for... and so that
    questions: [
      { id: 'u63-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I went to London ___ English.', options: ['for learn', 'to learn'], answer_index: 1, explanation: 'Untuk menyatakan tujuan (kenapa pergi ke suatu tempat), langsung gunakan "to + V1".' },
      { id: 'u63-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I hurried so ___ I wouldn\'t be late.', accepted_answers: ['that'], explanation: 'Gunakan "so that" untuk menyatakan tujuan jika diikuti oleh subjek baru (I).' },
      { id: 'u63-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which is correct to describe the purpose of an object?', options: ['This machine is for cutting bread.', 'This machine is to cut bread.'], answer_index: 0, explanation: 'Untuk menjelaskan fungsi alat secara umum, gunakan "for + V-ing".' }
    ]
  },
  {
    unit: 64, // Adjective + to
    questions: [
      { id: 'u64-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'It is difficult ___ Japanese.', options: ['learning', 'to learn'], answer_index: 1, explanation: 'Struktur: "It is + adjective (difficult) + to + infinitive".' },
      { id: 'u64-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I was surprised ___ (see) him there.', accepted_answers: ['to see'], explanation: 'Perasaan/reaksi terhadap sesuatu menggunakan "adjective + to + V1".' },
      { id: 'u64-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "He is bound failing the exam."', options: ['He is bound to fail the exam.', 'He is bound fail the exam.'], answer_index: 0, explanation: '"Bound" (pasti terjadi) dan "sure" / "certain" selalu diikuti "to + infinitive".' }
    ]
  },
  {
    unit: 65, // To... (afraid to do)
    questions: [
      { id: 'u65-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I am afraid ___ that dog.', options: ['of', 'to'], answer_index: 0, explanation: 'Jika merujuk pada benda/orang yang ditakuti, gunakan "afraid of".' },
      { id: 'u65-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'She was afraid ___ (go) out alone.', accepted_answers: ['to go'], explanation: 'Takut MELAKUKAN sesuatu dengan sengaja menggunakan "afraid to".' },
      { id: 'u65-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Difference: "Afraid to walk under the ladder" vs "Afraid of falling".', options: ['"Afraid to walk" is deliberate action. "Afraid of falling" is an accidental bad result.', 'No difference.'], answer_index: 0, explanation: '"Afraid to" untuk aksi yang disengaja. "Afraid of -ing" untuk hasil buruk yang tidak disengaja/bencana.' }
    ]
  },
  {
    unit: 71, // Countable/uncountable with a/an and some
    questions: [
      { id: 'u71-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'Did you buy ___?', options: ['an apple', 'a apple'], answer_index: 0, explanation: '"Apple" diawali huruf vokal (bunyi vokal), jadi menggunakan "an".' },
      { id: 'u71-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I need ___ (some) time to think.', accepted_answers: ['some'], explanation: '"Time" (waktu) adalah uncountable noun.' },
      { id: 'u71-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which is correct?', options: ['I have a good news for you.', 'I have some good news for you.'], answer_index: 1, explanation: '"News" tidak bisa dihitung. Tidak boleh memakai "a".' }
    ]
  },
  {
    unit: 77, // Names with and without the 1
    questions: [
      { id: 'u77-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'We visited ___ last year.', options: ['Canada', 'the Canada'], answer_index: 0, explanation: 'Nama negara tunggal TIDAK memakai "the".' },
      { id: 'u77-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'Have you ever been to ___ (Netherlands)?', accepted_answers: ['the Netherlands'], explanation: 'Negara jamak (berakhiran -s) selalu memakai "the".' },
      { id: 'u77-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which group of islands is correct?', options: ['Canary Islands', 'the Canary Islands'], answer_index: 1, explanation: 'Gugusan pulau (jamak) memakai "the".' }
    ]
  },
  {
    unit: 78, // Names with and without the 2
    questions: [
      { id: 'u78-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I read about it in ___.', options: ['Washington Post', 'the Washington Post'], answer_index: 1, explanation: 'Sebagian besar nama surat kabar memakai "the".' },
      { id: 'u78-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'We went to ___ (National Gallery).', accepted_answers: ['the National Gallery'], explanation: 'Nama museum dan galeri seni memakai "the".' },
      { id: 'u78-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which street name is correct?', options: ['the Oxford Street', 'Oxford Street'], answer_index: 1, explanation: 'Nama jalan, alun-alun, dan taman biasanya TIDAK memakai "the".' }
    ]
  },
  {
    unit: 82, // All of / most of / no / none of
    questions: [
      { id: 'u82-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: '___ students passed the exam.', options: ['Most', 'Most of'], answer_index: 0, explanation: 'Bicara secara umum, jangan gunakan "of".' },
      { id: 'u82-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: '___ (None) of the shops were open.', accepted_answers: ['None'], explanation: 'Jika ada kata "of", gunakan "None", bukan "No".' },
      { id: 'u82-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which is correct?', options: ['All of us are going.', 'All us are going.'], answer_index: 0, explanation: 'Sebelum kata ganti benda (us/them/it), WAJIB memakai "of".' }
    ]
  },
  {
    unit: 83, // Both / both of / neither / either
    questions: [
      { id: 'u83-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I like ___ of them.', options: ['both', 'either'], answer_index: 0, explanation: 'Menyukai kedua-duanya menggunakan "both".' },
      { id: 'u83-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: '"Do you want tea or coffee?" - "___ (Either), I don\'t mind."', accepted_answers: ['Either'], explanation: 'Artinya "yang mana saja boleh dari dua pilihan".' },
      { id: 'u83-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Fix the error: "Both them are married."', options: ['Both of them are married.', 'Both they are married.'], answer_index: 0, explanation: 'Untuk kata ganti (them/us/you), wajib menggunakan "of" (both of them).' }
    ]
  },
  {
    unit: 84, // All, every and whole
    questions: [
      { id: 'u84-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I spent ___ day reading.', options: ['all', 'whole'], answer_index: 0, explanation: 'Bisa "all day" atau "the whole day". Opsi "whole" kurang "the".' },
      { id: 'u84-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'She has read ___ (every) book in the library.', accepted_answers: ['every'], explanation: 'Kata "every" diikuti benda tunggal (book).' },
      { id: 'u84-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which is correct?', options: ['I ate the all cake.', 'I ate the whole cake.'], answer_index: 1, explanation: 'Urutannya: "the whole [noun]" ATAU "all the [noun]".' }
    ]
  },
  {
    unit: 85, // Each and every
    questions: [
      { id: 'u85-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: '___ student has a book.', options: ['Each', 'All'], answer_index: 0, explanation: '"Each" diikuti oleh kata benda singular (student).' },
      { id: 'u85-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'They ___ (each) have a book.', accepted_answers: ['each'], explanation: '"Each" bisa diletakkan di tengah kalimat setelah subjek.' },
      { id: 'u85-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Difference: "Every time I see you..." vs "Each time I see you..."', options: ['"Every" focuses on the group/frequency. "Each" focuses on individual separate times.', 'No difference at all.'], answer_index: 0, explanation: 'Secara makna sangat mirip, tapi "each" lebih fokus pada setiap satu kejadian secara terpisah.' }
    ]
  },
  {
    unit: 86, // Relative clauses 1 (who/that/which)
    questions: [
      { id: 'u86-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'The boy ___ is sitting there is my brother.', options: ['who', 'which'], answer_index: 0, explanation: '"Who" digunakan untuk orang.' },
      { id: 'u86-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'Where is the cheese ___ (that/which) was in the fridge?', accepted_answers: ['that', 'which'], explanation: 'Untuk benda mati, gunakan that atau which.' },
      { id: 'u86-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which is correct?', options: ['The people who works here are very friendly.', 'The people who work here are very friendly.'], answer_index: 1, explanation: '"The people" itu jamak (plural). Maka verb setelah "who" juga harus jamak (work, tanpa s).' }
    ]
  },
  {
    unit: 88, // Much, many, little, few (again, let's diversify)
    questions: [
      { id: 'u88-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'Do you have ___ friends here?', options: ['many', 'much'], answer_index: 0, explanation: '"Friends" bisa dihitung (countable).' },
      { id: 'u88-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I don\'t drink ___ (much) coffee.', accepted_answers: ['much'], explanation: '"Coffee" tidak bisa dihitung (uncountable).' },
      { id: 'u88-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Is it correct to say: "We had much fun."', options: ['Yes, it is common.', 'No, we usually say "a lot of fun" in positive sentences.'], answer_index: 1, explanation: 'Dalam kalimat positif, "a lot of" jauh lebih alami daripada "much/many".' }
    ]
  },
  {
    unit: 89, // A little / a few
    questions: [
      { id: 'u89-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'I speak ___ Spanish, so I can order food.', options: ['little', 'a little'], answer_index: 1, explanation: '"A little" bermakna positif (sedikit tapi cukup untuk digunakan).' },
      { id: 'u89-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'He is very lonely. He has ___ (few) friends.', accepted_answers: ['few'], explanation: 'Tanpa awalan "a", bermakna negatif (miris/hampir tidak ada).' },
      { id: 'u89-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'What does "a few" mean?', options: ['Some, a small number.', 'Almost none.'], answer_index: 0, explanation: '"A few" bermakna beberapa (positif).' }
    ]
  },
  {
    unit: 91, // Both / either / neither (Wait, 91 is All / every / whole? No, 91 is usually "Both/either/neither". Let's do a mix).
    questions: [
      { id: 'u91-m-1', type: 'multiple_choice', difficulty: 'medium', source: 'ai_generated', prompt: 'Neither of them ___ here.', options: ['is', 'are'], answer_index: 0, explanation: 'Secara formal grammar, "Neither of" diikuti verb tunggal (is). (Meski dalam spoken English "are" sering dipakai).' },
      { id: 'u91-m-2', type: 'fill_blank', difficulty: 'medium', source: 'ai_generated', prompt: 'I didn\'t like ___ (either) of the movies.', accepted_answers: ['either'], explanation: 'Dalam kalimat negatif, gunakan "either" bukan "neither".' },
      { id: 'u91-h-1', type: 'multiple_choice', difficulty: 'hard', source: 'ai_generated', prompt: 'Which is correct?', options: ['Both the restaurants are good.', 'Both of restaurants are good.'], answer_index: 0, explanation: 'Bisa memakai "Both the [noun]" atau "Both of the [noun]". Opsi kedua salah karena kurang "the".' }
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
console.log('Tingkat B Batch 2 done!');
